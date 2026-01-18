/**
 * Extracts the raw token value from a Bearer Authorization header.
 * @param headerValue - The Authorization header value (e.g., "Bearer <token>")
 * @returns The token string without the Bearer prefix, or undefined if missing.
 */
export const parseBearerToken = (headerValue?: string | null) =>
  headerValue ? headerValue.replace(/^Bearer\s+/i, "").trim() : undefined;
