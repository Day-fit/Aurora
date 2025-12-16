"use server";

import { cookies } from "next/headers";

export async function isLoggedInServer() {
  return !!(await cookies()).get("accessToken")?.value;
}
