"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { ApiService } from "@/lib/backend/api-config";

export async function generateResume(data: any) {
  return await callBackend({
    endpoint: "/api/v1/core/resume/generate",
    method: RequestMethod.POST,
    body: data,
    service: ApiService.CORE,
  });
}
