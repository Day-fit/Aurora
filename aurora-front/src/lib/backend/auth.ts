"use server";

import { cookies } from "next/headers";

export async function isLoggedInServer() {
  return !!(await cookies()).get("refreshToken")?.value;
}
