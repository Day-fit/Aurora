"use server";

import { cookies } from "next/headers";

export async function getResumePdf(
  id: string,
): Promise<{ data: string | null; status: number }> {
  const BASE_URL = process.env.BACKEND_CORE_URL;
  if (!BASE_URL) {
    throw new Error("BACKEND_CORE_URL is not defined");
  }

  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const url = `${BASE_URL.replace(/\/$/, "")}/api/v1/core/resume/getPdf?id=${id}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: cookieHeader,
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
