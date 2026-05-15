"use server";

import { revalidatePath } from "next/cache";
import {
  createLogicalComponent,
  createLogicalFlow,
  deleteLogicalComponent,
  deleteLogicalFlow,
} from "@/lib/db/logical";
import type {
  LogicalComponent,
  LogicalComponentKind,
  LogicalFlow,
  LogicalFlowKind,
} from "@/lib/types";

type Ok<T> = { ok: true } & T;
type Err = { ok: false; error: string };

function err(e: unknown, fallback: string): Err {
  return { ok: false, error: e instanceof Error ? e.message : fallback };
}

export async function addLogicalComponent(input: {
  capabilityId: string;
  name: string;
  kind: LogicalComponentKind;
  description?: string;
}): Promise<Ok<{ component: LogicalComponent }> | Err> {
  try {
    const component = await createLogicalComponent(input);
    revalidatePath("/architecture");
    return { ok: true, component };
  } catch (e) {
    return err(e, "Failed to add component.");
  }
}

export async function removeLogicalComponent(
  id: string,
): Promise<Ok<{ id: string }> | Err> {
  try {
    await deleteLogicalComponent(id);
    revalidatePath("/architecture");
    return { ok: true, id };
  } catch (e) {
    return err(e, "Failed to remove component.");
  }
}

export async function addLogicalFlow(input: {
  from: string;
  to: string;
  kind: LogicalFlowKind;
  label?: string;
}): Promise<Ok<{ flow: LogicalFlow }> | Err> {
  try {
    const flow = await createLogicalFlow(input);
    revalidatePath("/architecture");
    return { ok: true, flow };
  } catch (e) {
    return err(e, "Failed to add flow.");
  }
}

export async function removeLogicalFlow(input: {
  from: string;
  to: string;
  kind: LogicalFlowKind;
}): Promise<Ok<{ removed: { from: string; to: string; kind: string } }> | Err> {
  try {
    await deleteLogicalFlow(input);
    revalidatePath("/architecture");
    return { ok: true, removed: input };
  } catch (e) {
    return err(e, "Failed to remove flow.");
  }
}
