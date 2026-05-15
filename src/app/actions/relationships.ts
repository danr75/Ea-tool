"use server";

import { revalidatePath } from "next/cache";
import {
  createRelationship,
  deleteRelationship,
} from "@/lib/db/relationships";
import type { Relationship, RelationshipKind } from "@/lib/types";

type Ok<T> = { ok: true } & T;
type Err = { ok: false; error: string };

function err(e: unknown, fallback: string): Err {
  return { ok: false, error: e instanceof Error ? e.message : fallback };
}

export async function addRelationship(input: {
  from: string;
  to: string;
  kind: RelationshipKind;
}): Promise<Ok<{ relationship: Relationship }> | Err> {
  try {
    const relationship = await createRelationship(input);
    revalidatePath("/architecture");
    return { ok: true, relationship };
  } catch (e) {
    return err(e, "Failed to add relationship.");
  }
}

export async function removeRelationship(input: {
  from: string;
  to: string;
  kind: RelationshipKind;
}): Promise<Ok<{ removed: { from: string; to: string; kind: string } }> | Err> {
  try {
    await deleteRelationship(input);
    revalidatePath("/architecture");
    return { ok: true, removed: input };
  } catch (e) {
    return err(e, "Failed to remove relationship.");
  }
}
