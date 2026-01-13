import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export default async function getAllResumes() {
  try {
    const { status, data } = await callBackend({
      endpoint: "/api/v1/core/resume/getAll",
      method: RequestMethod.GET,
      baseUrl: process.env.BACKEND_CORE_URL,
    });

    console.log("Fetched CVs:", data);

    if (status !== 200) return [];
    return data as any[];
  } catch (error) {
    console.error("Failed to fetch CVs:", error);
    return [];
  }
}
