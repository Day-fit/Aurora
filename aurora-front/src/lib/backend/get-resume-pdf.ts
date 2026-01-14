import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export async function getResumePdf(data: any) {
  return await callBackend({
    endpoint: "/api/v1/core/resume/getPdf",
    method: RequestMethod.GET,
    body: data,
    baseUrl: process.env.BACKEND_CORE_URL,
  });
}
