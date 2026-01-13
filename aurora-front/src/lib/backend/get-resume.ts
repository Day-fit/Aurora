import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { FormValues } from "@/lib/types/form";

export default async function getResume(
  id: string,
): Promise<FormValues | null> {
  try {
    const { status, data } = await callBackend<FormValues>({
      endpoint: `/api/v1/core/resume/get?id=${id}`,
      method: RequestMethod.GET,
      baseUrl: process.env.BACKEND_CORE_URL,
    });

    if (status !== 200) return null;
    return data;
  } catch (error) {
    console.error(`Failed to fetch CV with id ${id}:`, error);
    return null;
  }
}
