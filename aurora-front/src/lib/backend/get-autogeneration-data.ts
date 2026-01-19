"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";

export interface AutoGenerationData {
  title?: string;
  email?: string;
  website?: string;
  linkedIn?: string;
  gitHub?: string;
  profileImage?: string;
  profileDescription?: string;
  education: Array<{
    institution: string;
    major?: string;
    degree: string;
    fromYear: number;
    toYear?: number;
  }>;
  skills: Array<{
    name: string;
    level: string;
  }>;
  workExperiences: Array<{
    company: string;
    position: string;
    description?: string;
    startDate: string;
    endDate?: string;
  }>;
  personalPortfolios: Array<{
    name: string;
    description: string;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    year?: number;
  }>;
}

export default async function getAutoGenerationData(
  trackingId: string,
): Promise<{ data: AutoGenerationData | null; status: number }> {
  const response = await callBackend({
    endpoint: `/api/v1/core/autogeneration/${trackingId}`,
    method: RequestMethod.GET,
    baseUrl: process.env.BACKEND_CORE_URL,
  });

  return {
    data: response.status === 200 ? response.data : null,
    status: response.status,
  };
}
