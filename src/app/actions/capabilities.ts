"use server";

import { revalidatePath } from "next/cache";
import {
  createCapability,
  deleteCapability,
  updateCapabilityMaturity,
  updateCapabilityOwnership,
  updateCapabilitySummary,
} from "@/lib/db/capabilities";
import type { Capability, DomainId, MaturityLevel } from "@/lib/types";

type Ok<T> = { ok: true } & T;
type Err = { ok: false; error: string };

function err(e: unknown, fallback: string): Err {
  return {
    ok: false,
    error: e instanceof Error ? e.message : fallback,
  };
}

export async function saveCapabilitySummary(
  id: string,
  summary: string,
): Promise<Ok<{ capability: Capability }> | Err> {
  try {
    const capability = await updateCapabilitySummary(id, summary);
    revalidatePath("/architecture");
    return { ok: true, capability };
  } catch (e) {
    return err(e, "Failed to update summary.");
  }
}

export async function saveCapabilityMaturity(
  id: string,
  maturity: MaturityLevel,
): Promise<Ok<{ capability: Capability }> | Err> {
  try {
    const capability = await updateCapabilityMaturity(id, maturity);
    revalidatePath("/architecture");
    return { ok: true, capability };
  } catch (e) {
    return err(e, "Failed to update maturity.");
  }
}

export async function saveCapabilityOwnership(
  id: string,
  ownership: string,
): Promise<Ok<{ capability: Capability }> | Err> {
  try {
    const capability = await updateCapabilityOwnership(id, ownership);
    revalidatePath("/architecture");
    return { ok: true, capability };
  } catch (e) {
    return err(e, "Failed to update ownership.");
  }
}

export async function addCapability(
  domain: DomainId,
  name: string,
): Promise<Ok<{ capability: Capability }> | Err> {
  try {
    const capability = await createCapability({ domain, name });
    revalidatePath("/architecture");
    return { ok: true, capability };
  } catch (e) {
    return err(e, "Failed to create capability.");
  }
}

export async function removeCapability(
  id: string,
): Promise<Ok<{ id: string }> | Err> {
  try {
    await deleteCapability(id);
    revalidatePath("/architecture");
    return { ok: true, id };
  } catch (e) {
    return err(e, "Failed to delete capability.");
  }
}
