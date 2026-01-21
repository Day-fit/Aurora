"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { ApiService } from "@/lib/backend/api-config";

export default async function enhanceResume(id: string) {
  return await callBackend({
    endpoint: `/api/v1/core/resume/enhance?id=${id}`,
    method: RequestMethod.POST,
    service: ApiService.CORE,
  });
}
