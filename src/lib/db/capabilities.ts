import { prisma } from "@/lib/prisma";
import type { Capability, DomainId, MaturityLevel } from "@/lib/types";

const VALID_DOMAINS: DomainId[] = [
  "business-service",
  "data",
  "ai-automation",
  "technology",
  "security-governance",
];
const VALID_MATURITIES: MaturityLevel[] = [
  "emerging",
  "developing",
  "established",
  "core",
];

function toCapability(row: {
  id: string;
  domain: string;
  name: string;
  summary: string;
  maturity: string;
  reuse: number;
  ownership: string | null;
}): Capability {
  return {
    id: row.id,
    domain: row.domain as DomainId,
    name: row.name,
    summary: row.summary,
    maturity: row.maturity as MaturityLevel,
    reuse: row.reuse,
    ownership: row.ownership ?? undefined,
  };
}

export async function getAllCapabilities(): Promise<Capability[]> {
  const rows = await prisma.capability.findMany({ orderBy: { name: "asc" } });
  return rows.map(toCapability);
}

export async function updateCapabilitySummary(
  id: string,
  summary: string,
): Promise<Capability> {
  const trimmed = summary.trim();
  if (!trimmed) throw new Error("Summary cannot be empty.");
  if (trimmed.length > 500) throw new Error("Summary must be 500 characters or fewer.");
  const row = await prisma.capability.update({
    where: { id },
    data: { summary: trimmed },
  });
  return toCapability(row);
}

export async function updateCapabilityMaturity(
  id: string,
  maturity: MaturityLevel,
): Promise<Capability> {
  if (!VALID_MATURITIES.includes(maturity)) {
    throw new Error("Invalid maturity level.");
  }
  const row = await prisma.capability.update({
    where: { id },
    data: { maturity },
  });
  return toCapability(row);
}

export async function updateCapabilityOwnership(
  id: string,
  ownership: string,
): Promise<Capability> {
  const trimmed = ownership.trim();
  if (trimmed.length > 120) throw new Error("Ownership must be 120 characters or fewer.");
  const row = await prisma.capability.update({
    where: { id },
    data: { ownership: trimmed || null },
  });
  return toCapability(row);
}

function slugify(name: string) {
  return (
    "cap-" +
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
  );
}

export async function createCapability(input: {
  domain: DomainId;
  name: string;
}): Promise<Capability> {
  const name = input.name.trim();
  if (!name) throw new Error("Name cannot be empty.");
  if (name.length > 80) throw new Error("Name must be 80 characters or fewer.");
  if (!VALID_DOMAINS.includes(input.domain)) {
    throw new Error("Invalid domain.");
  }

  const baseId = slugify(name);
  let id = baseId;
  let attempt = 1;
  // Avoid id collisions by appending a numeric suffix.
  while (await prisma.capability.findUnique({ where: { id } })) {
    attempt += 1;
    id = `${baseId}-${attempt}`;
    if (attempt > 50) throw new Error("Could not generate a unique id.");
  }

  const row = await prisma.capability.create({
    data: {
      id,
      domain: input.domain,
      name,
      summary: "No summary yet — click the pencil to add one.",
      maturity: "developing",
      reuse: 0.5,
      ownership: null,
    },
  });
  return toCapability(row);
}

export async function deleteCapability(id: string): Promise<void> {
  await prisma.capability.delete({ where: { id } });
}
