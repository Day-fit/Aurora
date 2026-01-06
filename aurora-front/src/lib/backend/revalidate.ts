"use server";

import { revalidatePath } from "next/cache";

export async function revalidateHeader() {
  revalidatePath("/", "layout");
}
