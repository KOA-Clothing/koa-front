import { AxiosError } from "axios";

/**
 * Pulls a human-friendly message out of a failed request. The .NET API
 * returns an `ApiResponse` envelope (`{ isSuccess, error, errorCode }`), so
 * the server-provided `error` text is preferred over the raw Axios message.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { error?: unknown } | undefined;
    if (data && typeof data.error === "string" && data.error) return data.error;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong";
}

/**
 * True when the API answered 404 — the resource genuinely doesn't exist, as
 * opposed to the request failing. Worth its own check because the failure
 * envelope gives every status the same shape, so a missing product and a dead
 * network both arrive as `isError` with a string to show.
 */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404;
}

/**
 * Some successful responses carry a `message` field (the envelope shape is
 * loose); fall back to `fallback` when it isn't present.
 */
export function getSuccessMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}