"use server";

import { revalidatePath } from "next/cache";
import {
  createPhysicalComponent,
  createPhysicalDependency,
  deletePhysicalComponent,
  deletePhysicalDependency,
  updatePhysicalComponent,
} from "@/lib/db/physical";
import type {
  PhysicalComponent,
  PhysicalDependency,
  PhysicalDependencyKind,
  PhysicalHost,
  PhysicalKind,
} from "@/lib/types";

type Ok<T> = { ok: true } & T;
type Err = { ok: false; error: string };

function err(e: unknown, fallback: string): Err {
  return { ok: false, error: e instanceof Error ? e.message : fallback };
}

export async function addPhysicalComponent(input: {
  capabilityId: string;
  name: string;
  kind: PhysicalKind;
  host: PhysicalHost;
  vendor?: string;
  description?: string;
  logicalComponentId?: string;
}): Promise<Ok<{ component: PhysicalComponent }> | Err> {
  try {
    const component = await createPhysicalComponent(input);
    revalidatePath("/architecture");
    return { ok: true, component };
  } catch (e) {
    return err(e, "Failed to add component.");
  }
}

export async function savePhysicalComponent(
  id: string,
  patch: {
    name?: string;
    kind?: PhysicalKind;
    host?: PhysicalHost;
    vendor?: string | null;
    description?: string | null;
    logicalComponentId?: string | null;
  },
): Promise<Ok<{ component: PhysicalComponent }> | Err> {
  try {
    const component = await updatePhysicalComponent(id, patch);
    revalidatePath("/architecture");
    return { ok: true, component };
  } catch (e) {
    return err(e, "Failed to save component.");
  }
}

export async function removePhysicalComponent(
  id: string,
): Promise<Ok<{ id: string }> | Err> {
  try {
    await deletePhysicalComponent(id);
    revalidatePath("/architecture");
    return { ok: true, id };
  } catch (e) {
    return err(e, "Failed to remove component.");
  }
}

export async function addPhysicalDependency(input: {
  from: string;
  to: string;
  kind: PhysicalDependencyKind;
  label?: string;
}): Promise<Ok<{ dependency: PhysicalDependency }> | Err> {
  try {
    const dependency = await createPhysicalDependency(input);
    revalidatePath("/architecture");
    return { ok: true, dependency };
  } catch (e) {
    return err(e, "Failed to add dependency.");
  }
}

export async function removePhysicalDependency(input: {
  from: string;
  to: string;
  kind: PhysicalDependencyKind;
}): Promise<Ok<{ removed: { from: string; to: string; kind: string } }> | Err> {
  try {
    await deletePhysicalDependency(input);
    revalidatePath("/architecture");
    return { ok: true, removed: input };
  } catch (e) {
    return err(e, "Failed to remove dependency.");
  }
}
