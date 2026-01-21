import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { ApiService } from "@/lib/backend/api-config";

export default async function getAllResumes() {
  try {
    const { status, data } = await callBackend({
      endpoint: "/api/v1/core/resume/getAll",
      method: RequestMethod.GET,
      service: ApiService.CORE,
    });

    if (status !== 200) return [];
    return data as any[];
  } catch (error) {
    console.error("Failed to fetch CVs:", error);
    return [];
  }
}
