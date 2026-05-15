"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createEmerging,
  deleteEmerging,
  updateEmerging,
} from "@/lib/db/emerging";
import {
  createEmergingImpact,
  deleteEmergingImpact,
} from "@/lib/db/emerging-impacts";
import type {
  AdoptionHorizon,
  CapabilityImpact,
  EmergingCapability,
  ImpactKind,
  MaturityLevel,
} from "@/lib/types";

type Ok<T> = { ok: true } & T;
type Err = { ok: false; error: string };

function err(e: unknown, fallback: string): Err {
  return { ok: false, error: e instanceof Error ? e.message : fallback };
}

export async function addEmerging(input: {
  name: string;
  summary: string;
  category: string;
  horizon: AdoptionHorizon;
  likelihood: number;
  impact: number;
  urgency: number;
  maturity: MaturityLevel;
}): Promise<Ok<{ id: string }> | Err> {
  try {
    const created = await createEmerging(input);
    revalidatePath("/emerging");
    return { ok: true, id: created.id };
  } catch (e) {
    return err(e, "Failed to create signal.");
  }
}

export async function saveEmerging(
  id: string,
  patch: {
    name?: string;
    summary?: string;
    category?: string;
    horizon?: AdoptionHorizon;
    likelihood?: number;
    impact?: number;
    urgency?: number;
    maturity?: MaturityLevel;
  },
): Promise<Ok<{ capability: EmergingCapability }> | Err> {
  try {
    const capability = await updateEmerging(id, patch);
    revalidatePath("/emerging");
    revalidatePath(`/emerging/${id}`);
    revalidatePath("/architecture");
    return { ok: true, capability };
  } catch (e) {
    return err(e, "Failed to update signal.");
  }
}

export async function removeEmerging(id: string): Promise<void> {
  await deleteEmerging(id);
  revalidatePath("/emerging");
  revalidatePath("/architecture");
  redirect("/emerging");
}

export async function addImpact(input: {
  signalId: string;
  capabilityId: string;
  kind: ImpactKind;
  note: string;
}): Promise<Ok<{ impact: CapabilityImpact }> | Err> {
  try {
    const impact = await createEmergingImpact(input);
    revalidatePath(`/emerging/${input.signalId}`);
    revalidatePath("/architecture");
    return { ok: true, impact };
  } catch (e) {
    return err(e, "Failed to add impact.");
  }
}

export async function removeImpact(input: {
  signalId: string;
  capabilityId: string;
}): Promise<Ok<{ removed: true }> | Err> {
  try {
    await deleteEmergingImpact(input.signalId, input.capabilityId);
    revalidatePath(`/emerging/${input.signalId}`);
    revalidatePath("/architecture");
    return { ok: true, removed: true };
  } catch (e) {
    return err(e, "Failed to remove impact.");
  }
}
