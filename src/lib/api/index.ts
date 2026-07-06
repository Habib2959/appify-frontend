// isomorphic API helpers (safe on server and client)
// for server-only, cookie-aware calls import from "@/lib/api/server"
export { api, apiFetch, ApiError, type ApiRequestOptions } from "./client";
