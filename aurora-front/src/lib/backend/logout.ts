"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { callBackend } from "@/lib/backend/backend";
import { RequestMethod } from "@/lib/types/backend";
import { revalidateHeader } from "@/lib/backend/revalidate";

export async function logout() {
  try {
    // Notify the backend to invalidate the session
    await callBackend({
      endpoint: "/api/v1/auth/logout",
      method: RequestMethod.POST,
    });
  } catch (error) {
    console.error("Backend logout failed:", error);
  }

  const cookieStore = await cookies();

  // Clear local cookies
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  // Revalidate the header so the UI updates to "Logged Out" state
  await revalidateHeader();

  redirect("/");
}
