"use server";
import {
  BackendResponse,
  RequestMethod,
  RequestType,
} from "@/lib/types/backend";
import { cookies } from "next/headers";

export async function callBackend<T = any>({
  method = RequestMethod.POST,
  endpoint,
  body = null,
  baseUrl,
}: RequestType): Promise<BackendResponse<T>> {
  const BASE_URL = baseUrl || process.env.BACKEND_AUTH_URL;
  if (!BASE_URL) {
    throw new Error("Base URL is not defined");
  }
  console.log("Calling backend:", endpoint, method, body, BASE_URL);

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;

  const getHeaders = (token?: string) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
  };

  let res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: getHeaders(accessToken),
    body: body ? JSON.stringify(body) : null,
    cache: "no-store",
  });

  if (res.status === 401) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          const newAccessToken = refreshData.accessToken;
          const newRefreshToken = refreshData.refreshToken;

          cookieStore.set("accessToken", newAccessToken, {
            httpOnly: true,
            path: "/",
          });
          if (newRefreshToken) {
            cookieStore.set("refreshToken", newRefreshToken, {
              httpOnly: true,
              path: "/",
            });
          }

          res = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: getHeaders(newAccessToken),
            body: body ? JSON.stringify(body) : null,
            cache: "no-store",
          });
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }
  }

  // Handle cases where response might not be JSON (optional but safer)
  const text = await res.text();
  let data: T;
  try {
    data = JSON.parse(text);
  } catch {
    data = text as any;
  }

  return { status: res.status, data };
}
