import { cookies } from "next/headers";
import { apiFetch, type ApiRequestOptions } from "./client";

// forwards the incoming request cookies (access_token/refresh_token) to the API
async function getCookieHeader(): Promise<string> {
	const store = await cookies();
	return store
		.getAll()
		.map((c) => `${c.name}=${c.value}`)
		.join("; ");
}

// like apiFetch, but forwards auth cookies from the current request.
// refresh is disabled here (Server Components can't set response cookies);
// on 401 let the page redirect to login.
async function serverFetch<T = unknown>(
	path: string,
	options: ApiRequestOptions = {},
): Promise<T> {
	const headers = new Headers(options.headers);
	const cookie = await getCookieHeader();
	if (cookie) headers.set("cookie", cookie);
	return apiFetch<T>(path, { ...options, headers, skipAuthRefresh: true });
}

// server-side verb helpers; use inside Server Components and Route Handlers
export const serverApi = {
	get: <T = unknown>(path: string, options?: ApiRequestOptions) =>
		serverFetch<T>(path, { ...options, method: "GET" }),
	post: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
		serverFetch<T>(path, { ...options, method: "POST", body }),
	put: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
		serverFetch<T>(path, { ...options, method: "PUT", body }),
	patch: <T = unknown>(path: string, body?: unknown, options?: ApiRequestOptions) =>
		serverFetch<T>(path, { ...options, method: "PATCH", body }),
	delete: <T = unknown>(path: string, options?: ApiRequestOptions) =>
		serverFetch<T>(path, { ...options, method: "DELETE" }),
};
