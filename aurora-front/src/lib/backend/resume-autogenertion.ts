"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export default async function resumeAutogeneration(data: any) {
  console.log(data);
  return await callBackend({
    endpoint: `/api/v1/core/autogeneration/`,
    method: RequestMethod.POST,
    body: data,
    baseUrl: process.env.BACKEND_CORE_URL,
  });
}
