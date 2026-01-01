"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export async function generateCv(data: any) {
  return await callBackend({
    endpoint: "/api/v1/core/generate",
    method: RequestMethod.POST,
    body: data,
  });
}
