"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export async function generateResume(data: any) {
  return await callBackend({
    endpoint: "/api/v1/core/resume/generate",
    method: RequestMethod.POST,
    body: data,
    baseUrl: process.env.BACKEND_CORE_URL,
  });
}
