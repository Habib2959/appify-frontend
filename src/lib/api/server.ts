import { cookies } from "next/headers";
import { apiFetch, type ApiRequestOptions } from "./client";

async function getCookieHeader(): Promise<string> {
	const store = await cookies();
	return store
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");
}

// refresh disabled: Server Components can't set response cookies, so a 401
// here just lets the page redirect to login instead of retrying.
async function serverFetch<T = unknown>(
	path: string,
	options: ApiRequestOptions = {},
): Promise<T> {
	const headers = new Headers(options.headers);
	const cookie = await getCookieHeader();
	if (cookie) headers.set("cookie", cookie);
	return apiFetch<T>(path, { ...options, headers, skipAuthRefresh: true });
}

export const serverApi = {
	get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
		serverFetch<T>(path, { ...options, method: "GET" }),
	post: <T = unknown>(
		path: string,
		body?: unknown,
		options?: ApiRequestOptions,
	) => serverFetch<T>(path, { ...options, method: "POST", body }),
	put: <T = unknown>(
		path: string,
		body?: unknown,
		options?: ApiRequestOptions,
	) => serverFetch<T>(path, { ...options, method: "PUT", body }),
	patch: <T = unknown>(
		path: string,
		body?: unknown,
		options?: ApiRequestOptions,
	) => serverFetch<T>(path, { ...options, method: "PATCH", body }),
	delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
		serverFetch<T>(path, { ...options, method: "DELETE" }),
};
