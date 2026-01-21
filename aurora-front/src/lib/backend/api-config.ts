/**
 * Centralized API configuration for all backend services.
 * This eliminates repeated baseUrl lookups and protocol checks throughout the codebase.
 */

export enum ApiService {
  AUTH = "AUTH",
  CORE = "CORE",
}

const SERVICE_ENV_MAP: Record<ApiService, string> = {
  [ApiService.AUTH]: "BACKEND_AUTH_URL",
  [ApiService.CORE]: "BACKEND_CORE_URL",
};

function getServiceHost(service: ApiService): string {
  const envVar = SERVICE_ENV_MAP[service];
  const host = process.env[envVar];
  if (!host) {
    throw new Error(`${envVar} is not defined`);
  }
  return host;
}

function getProtocol(): string {
  return process.env.NODE_ENV === "production" ? "https" : "http";
}

/**
 * Get the full base URL for a service (with protocol).
 */
export function getBaseUrl(service: ApiService): string {
  const host = getServiceHost(service);
  return `${getProtocol()}://${host.replace(/\/$/, "")}`;
}

/**
 * Build a full URL for a given service and endpoint.
 */
export function buildUrl(service: ApiService, endpoint: string): string {
  const baseUrl = getBaseUrl(service);
  return `${baseUrl}/${endpoint.replace(/^\//, "")}`;
}

/**
 * Get the raw host (without protocol) for a service.
 * Useful when callBackend handles protocol internally.
 */
export function getServiceBaseUrl(service: ApiService): string {
  return getServiceHost(service);
}
