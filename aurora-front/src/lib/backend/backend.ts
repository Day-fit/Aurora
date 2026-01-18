"use server";

import {
  BackendResponse,
  RequestMethod,
  RequestType,
} from "@/lib/types/backend";
import { cookies } from "next/headers";
import { parseBearerToken } from "@/lib/utils/parse-bearer-token";

export async function callBackend<T = any>({
  method = RequestMethod.POST,
  endpoint,
  body = null,
  baseUrl,
}: RequestType): Promise<BackendResponse<T>> {
  const BASE_URL =
    (process.env.NODE_ENV == "production" ? "https://" : "http://") +
    (baseUrl || process.env.BACKEND_AUTH_URL);
  if (!BASE_URL) {
    throw new Error("Base URL is not defined");
  }

  console.log(
    `Calling backend with method ${method} and endpoint ${BASE_URL + endpoint}`,
  );
  const cookieStore = await cookies();

  const getAccessToken = () => cookieStore.get("accessToken")?.value;
  const getRefreshToken = () => cookieStore.get("refreshToken")?.value;

  const buildCookieHeader = () => {
    const refreshToken = getRefreshToken();
    return refreshToken ? `refreshToken=${refreshToken}` : "";
  };

  const applySetCookieHeader = (setCookieHeader: string | null) => {
    if (!setCookieHeader) {
      return;
    }

    const cookiesToSet = setCookieHeader.split(/,(?=[^;]+=[^;]+)/);
    cookiesToSet.forEach((cookieString) => {
      const [nameValue] = cookieString.split(";");
      const [name, value] = nameValue.split("=");
      const cookieName = name.trim();
      cookieStore.set(cookieName, value.trim(), {
        httpOnly: cookieName === "refreshToken",
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    });
  };

  const storeAccessToken = (token?: string) => {
    if (!token) {
      return;
    }

    cookieStore.set("accessToken", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  };

  const parseJson = <U>(value: string): U | null => {
    try {
      return JSON.parse(value) as U;
    } catch {
      return null;
    }
  };

  const getHeaders = (includeAuth = true) => {
    const headers: Record<string, string> = {};
    const cookieHeader = buildCookieHeader();
    if (cookieHeader) {
      headers.Cookie = cookieHeader;
    }
    if (includeAuth) {
      const accessToken = getAccessToken();
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    // ONLY add Content-Type if we are actually sending a body
    if (body && method !== RequestMethod.GET) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  };

  const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  let res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  // If the backend sent Set-Cookie headers (on login or any request),
  // we must capture them and set them in Next.js
  applySetCookieHeader(res.headers.get("set-cookie"));

  if (res.status === 401) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: getHeaders(false),
          cache: "no-store",
        });

        applySetCookieHeader(refreshRes.headers.get("set-cookie"));
        const refreshText = await refreshRes.text();
        const refreshData = refreshText
          ? parseJson<{ accessToken?: string }>(refreshText)
          : null;

        const refreshAccessToken =
          parseBearerToken(refreshRes.headers.get("authorization")) ||
          refreshData?.accessToken;
        storeAccessToken(refreshAccessToken);

        if (refreshRes.ok) {
          // Retry the original request with the new Authorization header
          res = await fetch(url, {
            method,
            headers: getHeaders(),
            body: body ? JSON.stringify(body) : undefined,
            cache: "no-store",
          });
          applySetCookieHeader(res.headers.get("set-cookie"));
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

  const responseAccessToken =
    parseBearerToken(res.headers.get("authorization")) ||
    (typeof data === "object" && data && "accessToken" in data
      ? (data as { accessToken?: string }).accessToken
      : undefined);
  storeAccessToken(responseAccessToken);

  return {
    status: res.status,
    data,
  };
}
