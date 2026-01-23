"use server";

import {
  BackendResponse,
  RequestMethod,
  RequestType,
} from "@/lib/types/backend";
import { cookies } from "next/headers";
import { parseBearerToken } from "@/lib/utils/parse-bearer-token";
import { ApiService, getServiceBaseUrl } from "@/lib/backend/api-config";

const APPLICATION_JSON = "application/json";

export async function callBackend<T = any>({
  method = RequestMethod.POST,
  endpoint,
  body = null,
  service = ApiService.AUTH,
  file = null,
}: RequestType): Promise<BackendResponse<T>> {
  const host = getServiceBaseUrl(service);
  const authHost = getServiceBaseUrl(ApiService.AUTH);
  const protocol =
    process.env.NODE_ENV === "production" ? "https://" : "http://";
  const BASE_URL = protocol + host;
  const AUTH_BASE_URL = protocol + authHost;

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

    // ❗ FIX: only set Content-Type for pure JSON requests
    if (file === undefined && body && method !== RequestMethod.GET) {
      headers["Content-Type"] = APPLICATION_JSON;
    }

    return headers;
  };

  const buildRequestBody = (): FormData | string | undefined => {
    // ❗ FIX: multipart even when file === null
    if (file !== undefined) {
      const formData = new FormData();

      if (body) {
        formData.append(
          "requestDto",
          new Blob([JSON.stringify(body)], { type: APPLICATION_JSON }),
        );
      }

      if (file instanceof File) {
        formData.append("image", file);
      }

      return formData;
    }

    return body ? JSON.stringify(body) : undefined;
  };

  const url = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  // Don't include body for GET/HEAD requests
  const requestBody = method === RequestMethod.GET ? undefined : buildRequestBody();

  let res = await fetch(url, {
    method,
    headers: getHeaders(),
    body: requestBody,
    cache: "no-store",
  });

  applySetCookieHeader(res.headers.get("set-cookie"));

  if (res.status === 401 || res.status === 403) {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${AUTH_BASE_URL}/api/v1/auth/refresh`, {
          method: "POST",
          headers: getHeaders(true),
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
          res = await fetch(url, {
            method,
            headers: getHeaders(),
            body: requestBody,
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
