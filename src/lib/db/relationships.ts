import { prisma } from "@/lib/prisma";
import type { Relationship, RelationshipKind } from "@/lib/types";

function toRelationship(row: {
  fromId: string;
  toId: string;
  kind: string;
  strength: number;
}): Relationship {
  return {
    from: row.fromId,
    to: row.toId,
    kind: row.kind as RelationshipKind,
    strength: row.strength,
  };
}

export async function getAllRelationships(): Promise<Relationship[]> {
  const rows = await prisma.relationship.findMany();
  return rows.map(toRelationship);
}

export async function createRelationship(input: {
  from: string;
  to: string;
  kind: RelationshipKind;
  strength?: number;
}): Promise<Relationship> {
  if (input.from === input.to) {
    throw new Error("A relationship can't point to the same capability.");
  }
  const strength = input.strength ?? 0.6;
  if (strength < 0 || strength > 1) {
    throw new Error("Strength must be between 0 and 1.");
  }
  try {
    const row = await prisma.relationship.create({
      data: {
        fromId: input.from,
        toId: input.to,
        kind: input.kind,
        strength,
      },
    });
    return toRelationship(row);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      throw new Error("That relationship already exists.");
    }
    throw e;
  }
}

export async function deleteRelationship(input: {
  from: string;
  to: string;
  kind: RelationshipKind;
}): Promise<void> {
  await prisma.relationship.deleteMany({
    where: {
      fromId: input.from,
      toId: input.to,
      kind: input.kind,
    },
  });
}
