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

  const cookieStore = await cookies();

  const buildCookieHeader = () =>
    cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

  const getHeaders = () => ({
    "Content-Type": "application/json",
    Cookie: buildCookieHeader(),
  });

  let res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
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
          cache: "no-store",
        });

        if (refreshRes.ok) {
          const { accessToken, refreshToken: newRefreshToken } =
            await refreshRes.json();

          cookieStore.set("accessToken", accessToken, {
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
            headers: getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
            cache: "no-store",
          });
        }
      } catch (err) {
        console.error("Token refresh failed:", err);
      }
    }
  }

  const text = await res.text();
  let data: T;

  try {
    data = JSON.parse(text);
  } catch {
    data = text as any;
  }

  return {
    status: res.status,
    data,
  };
}
