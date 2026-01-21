/**
 * Get a user-friendly error message for authentication errors.
 */
export function getAuthErrorMessage(error: string | null): string | null {
  switch (error) {
    case "OAuthFailed":
      return "Social login failed. Please try again.";
    case "ConnectionError":
      return "Could not connect to the auth server.";
    case "session_invalid":
      return "Your session has expired. Please log in again.";
    default:
      return null;
  }
}

/**
 * Build the OAuth login redirect URL.
 * @throws Error if NEXT_PUBLIC_BACKEND_AUTH_URL is not defined
 */
export function buildOAuthUrl(provider: string): string {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_AUTH_URL;
  if (!backendUrl) {
    throw new Error("NEXT_PUBLIC_BACKEND_AUTH_URL is not defined");
  }
  const callbackUrl = `${window.location.origin}/auth/callback`;
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${backendUrl}/oauth2/authorization/${provider}?redirect_uri=${callbackUrl}`;
}

/**
 * Handle OAuth login redirect.
 */
export function handleOAuthLogin(provider: string): void {
  window.location.href = buildOAuthUrl(provider);
}
