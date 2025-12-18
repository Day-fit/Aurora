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
}: RequestType): Promise<BackendResponse<T>> {
  const BASE_URL = process.env.BACKEND_AUTH_URL;
  if (!BASE_URL) {
    throw new Error("BACKEND_URL is not configured");
  }

  const token = (await cookies()).get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data: T = await res.json();
  return { status: res.status, data };
}
