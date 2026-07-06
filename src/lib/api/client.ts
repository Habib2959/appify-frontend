import { API_URL } from "@/lib/config";

export class ApiError extends Error {
	readonly status: number;
	readonly data: unknown;

	constructor(status: number, message: string, data: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
}

type QueryValue = string | number | boolean | null | undefined;

export type ApiRequestOptions = Omit<RequestInit, "body"> & {
	// query string params; null/undefined are skipped
	params?: Record<string, QueryValue>;
	// plain objects are JSON-encoded; FormData/string sent as-is
	body?: unknown;
	// bearer token; on the server prefer serverApi which reads it from cookies
	token?: string | null;
	next?: NextFetchRequestConfig;
	// skip the automatic 401 -> refresh -> retry (used internally)
	skipAuthRefresh?: boolean;
};

const REFRESH_PATH = "/user/refresh";

// server can use an internal URL (e.g. docker service host); browser uses public URL
function getBaseUrl(): string {
	if (typeof window === "undefined") {
		return process.env.APPIFY_API_URL_INTERNAL || API_URL;
	}
	return API_URL;
}

function buildUrl(path: string, params?: Record<string, QueryValue>): string {
	const base = getBaseUrl().replace(/\/$/, "");
	const url = path.startsWith("http")
		? path
		: `${base}/${path.replace(/^\//, "")}`;
	if (!params) return url;

	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined) search.append(key, String(value));
	}
	const qs = search.toString();
	return qs ? `${url}?${qs}` : url;
}

function isPlainBody(body: unknown): boolean {
	return (
		body !== null &&
		typeof body === "object" &&
		!(body instanceof FormData) &&
		!(body instanceof Blob) &&
		!(body instanceof ArrayBuffer)
	);
}

export async function apiFetch<T = unknown>(
	path: string,
	options: ApiRequestOptions = {},
): Promise<T> {
	const { params, body, token, headers, next, skipAuthRefresh, ...rest } =
		options;

	const finalHeaders = new Headers(headers);
	if (!finalHeaders.has("Accept")) finalHeaders.set("Accept", "application/json");
	if (token) finalHeaders.set("Authorization", `Bearer ${token}`);

	let finalBody: BodyInit | undefined;
	if (body !== undefined) {
		if (isPlainBody(body)) {
			if (!finalHeaders.has("Content-Type"))
				finalHeaders.set("Content-Type", "application/json");
			finalBody = JSON.stringify(body);
		} else {
			finalBody = body as BodyInit;
		}
	}

	const response = await fetch(buildUrl(path, params), {
		// send cookies to the API by default (auth sessions)
		credentials: "include",
		...rest,
		headers: finalHeaders,
		body: finalBody,
		...(next ? { next } : {}),
	});

	// on an expired access token, try to refresh once (browser only) then retry
	if (
		response.status === 401 &&
		!skipAuthRefresh &&
		typeof window !== "undefined" &&
		!path.startsWith(REFRESH_PATH)
	) {
		const refreshed = await refreshTokens();
		if (refreshed) {
			return apiFetch<T>(path, { ...options, skipAuthRefresh: true });
		}
	}

	const raw = await response.text();
	const data = raw ? safeJson(raw) : undefined;

	if (!response.ok) {
		const message =
			(isPlainBody(data) && "message" in (data as object)
				? String((data as { message: unknown }).message)
				: response.statusText) || "Request failed";
		throw new ApiError(response.status, message, data);
	}

	return data as T;
}

// single-flight refresh: concurrent 401s share one refresh request
let refreshInFlight: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
	if (!refreshInFlight) {
		refreshInFlight = fetch(buildUrl(REFRESH_PATH), {
			method: "POST",
			credentials: "include",
			headers: { Accept: "application/json" },
		})
			.then((res) => res.ok)
			.catch(() => false)
			.finally(() => {
				refreshInFlight = null;
			});
	}
	return refreshInFlight;
}

function safeJson(raw: string): unknown {
	try {
		return JSON.parse(raw);
	} catch {
		return raw;
	}
}

export const api = {
	get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
		apiFetch<T>(path, { ...options, method: "GET" }),
	post: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
		apiFetch<T>(path, { ...options, method: "POST", body }),
	put: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
		apiFetch<T>(path, { ...options, method: "PUT", body }),
	patch: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
		apiFetch<T>(path, { ...options, method: "PATCH", body }),
	delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
		apiFetch<T>(path, { ...options, method: "DELETE" }),
};
