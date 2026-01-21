"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { ApiService } from "@/lib/backend/api-config";

export default async function resumeAutogeneration(data: any) {
  console.log(data);
  return await callBackend({
    endpoint: `/api/v1/core/autogeneration/`,
    method: RequestMethod.POST,
    body: data,
    service: ApiService.CORE,
  });
}
