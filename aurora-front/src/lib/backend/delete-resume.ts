"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { ApiService } from "@/lib/backend/api-config";
import { revalidateCvList } from "@/lib/backend/revalidate";

export default async function deleteResume(resumeId: string) {
  try {
    const { status, data } = await callBackend({
      endpoint: `/api/v1/core/resume/${resumeId}`,
      method: RequestMethod.DELETE,
      service: ApiService.CORE,
    });

    if (status === 200) {
      await revalidateCvList();
    }

    return { status, data };
  } catch (error) {
    console.error("Failed to delete resume:", error);
    return { status: 500, data: null };
  }
}
