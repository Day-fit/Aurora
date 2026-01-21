"use server";

import { cookies } from "next/headers";
import { ApiService, buildUrl } from "@/lib/backend/api-config";

export async function getResumePdf(
  id: string,
): Promise<{ data: string | null; status: number }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const url = buildUrl(ApiService.CORE, `/api/v1/core/resume/getPdf?id=${id}`);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return { data: null, status: res.status };
  }

  const arrayBuffer = await res.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  return { data: base64, status: res.status };
}
