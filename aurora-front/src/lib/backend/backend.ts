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
  const BASE_URL =
    baseUrl ||
    process.env.BACKEND_AUTH_URL ||
    process.env.BACKEND_CORE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_AUTH_URL ||
    process.env.NEXT_PUBLIC_BACKEND_CORE_URL;
  if (!BASE_URL) {
    throw new Error("Base URL is not defined");
  }

  console.log(
    `Calling backend with method ${method} and endpoint ${BASE_URL + endpoint}`,
  );
  const cookieStore = await cookies();

  const buildCookieHeader = () =>
    cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

  const getAccessToken = () => cookieStore.get("accessToken")?.value;

  const getHeaders = () => {
    const headers: Record<string, string> = {
      Cookie: buildCookieHeader(),
    };
    const accessToken = getAccessToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    // ONLY add Content-Type if we are actually sending a body
    if (body && method !== RequestMethod.GET) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };

  const normalizedBase = BASE_URL.replace(/\/$/, "");
  const normalizedEndpoint = endpoint.replace(/^\//, "");
  const url = `${normalizedBase}/${normalizedEndpoint}`;

  let res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // If the backend sent Set-Cookie headers (on login or any request),
  // we must capture them and set them in Next.js
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookiesToSet = setCookieHeader.split(/,(?=[^;]+=[^;]+)/);
    cookiesToSet.forEach((cookieString) => {
      const [nameValue] = cookieString.split(";");
      const [name, value] = nameValue.split("=");
      cookieStore.set(name.trim(), value.trim(), {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });
    });
  }

  if (res.status === 401) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      try {
        const refreshRes = await fetch(
          `${normalizedBase}/api/v1/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
            cache: "no-store",
          },
        );

        if (refreshRes.ok) {
          // If your backend sends cookies via Set-Cookie headers,
          // we need to parse them and set them in our Next.js cookie store.
          const setCookieHeader = refreshRes.headers.get("set-cookie");

          if (setCookieHeader) {
            // Simplified logic: your backend might send multiple cookies
            // This logic ensures they get passed back to the client browser
            const cookiesToSet = setCookieHeader.split(/,(?=[^;]+=[^;]+)/);

            cookiesToSet.forEach((cookieString) => {
              const [nameValue] = cookieString.split(";");
              const [name, value] = nameValue.split("=");
              cookieStore.set(name.trim(), value.trim(), {
                httpOnly: true,
                path: "/",
                secure: process.env.NODE_ENV === "production",
              });
            });
          } else {
            // FALLBACK: If your backend still returns them in JSON for refresh
            const { accessToken, refreshToken: newRefreshToken } =
              await refreshRes.json();
            if (accessToken) {
              cookieStore.set("accessToken", accessToken, {
                httpOnly: true,
                path: "/",
              });
            }
            if (newRefreshToken) {
              cookieStore.set("refreshToken", newRefreshToken, {
                httpOnly: true,
                path: "/",
              });
            }
          }

          // Retry the original request with the new cookies
          res = await fetch(`${normalizedBase}/${normalizedEndpoint}`, {
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
