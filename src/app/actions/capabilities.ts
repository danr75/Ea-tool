"use server";

import { revalidatePath } from "next/cache";
import { updateCapabilitySummary } from "@/lib/db/capabilities";
import type { Capability } from "@/lib/types";

export async function saveCapabilitySummary(
  id: string,
  summary: string,
): Promise<{ ok: true; capability: Capability } | { ok: false; error: string }> {
  try {
    const capability = await updateCapabilitySummary(id, summary);
    revalidatePath("/architecture");
    return { ok: true, capability };
  } catch (e) {
    const error = e instanceof Error ? e.message : "Failed to update capability";
    return { ok: false, error };
  }
}
