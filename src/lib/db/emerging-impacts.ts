import { prisma } from "@/lib/prisma";
import type { CapabilityImpact, ImpactKind } from "@/lib/types";

export async function createEmergingImpact(input: {
  signalId: string;
  capabilityId: string;
  kind: ImpactKind;
  note: string;
}): Promise<CapabilityImpact> {
  const note = input.note.trim();
  if (!note) throw new Error("Note cannot be empty.");
  if (note.length > 400)
    throw new Error("Note must be 400 characters or fewer.");

  try {
    await prisma.emergingImpact.create({
      data: {
        signalId: input.signalId,
        capabilityId: input.capabilityId,
        kind: input.kind,
        note,
      },
    });
    return {
      capabilityId: input.capabilityId,
      kind: input.kind,
      note,
    };
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      throw new Error("That impact already exists for this signal.");
    }
    throw e;
  }
}

export async function deleteEmergingImpact(
  signalId: string,
  capabilityId: string,
): Promise<void> {
  await prisma.emergingImpact.deleteMany({
    where: { signalId, capabilityId },
  });
}
