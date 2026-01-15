"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export async function editResume(resumeId: string, changes: any) {
  return await callBackend({
    endpoint: "/api/v1/core/resume/edit",
    method: RequestMethod.PATCH,
    body: {
      resumeId,
      ...changes,
    },
    baseUrl: process.env.BACKEND_CORE_URL,
  });
}
