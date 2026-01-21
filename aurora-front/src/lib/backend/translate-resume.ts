"use server";

import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { ApiService } from "@/lib/backend/api-config";

export type TranslateLanguage =
  | "ENGLISH"
  | "POLISH"
  | "GERMAN"
  | "FRENCH"
  | "SPANISH"
  | "ITALIAN"
  | "PORTUGUESE"
  | "DUTCH"
  | "RUSSIAN"
  | "CHINESE"
  | "JAPANESE"
  | "KOREAN"
  | "ARABIC"
  | "HINDI"
  | "TURKISH"
  | "SWEDISH"
  | "NORWEGIAN"
  | "DANISH"
  | "FINNISH"
  | "CZECH"
  | "UKRAINIAN";

export default async function translateResume(
  resumeId: string,
  language: TranslateLanguage,
) {
  return await callBackend({
    endpoint: `/api/v1/core/resume/translate`,
    method: RequestMethod.POST,
    service: ApiService.CORE,
    body: {
      id: resumeId,
      language: language,
    },
  });
}
