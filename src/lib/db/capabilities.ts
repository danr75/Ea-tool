import { prisma } from "@/lib/prisma";
import type { Capability, DomainId, MaturityLevel } from "@/lib/types";

function toDomain(c: { domain: string }): DomainId {
  return c.domain as DomainId;
}

function toMaturity(c: { maturity: string }): MaturityLevel {
  return c.maturity as MaturityLevel;
}

export async function getAllCapabilities(): Promise<Capability[]> {
  const rows = await prisma.capability.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({
    id: r.id,
    domain: toDomain(r),
    name: r.name,
    summary: r.summary,
    maturity: toMaturity(r),
    reuse: r.reuse,
    ownership: r.ownership ?? undefined,
  }));
}

export async function updateCapabilitySummary(
  id: string,
  summary: string,
): Promise<Capability> {
  const trimmed = summary.trim();
  if (!trimmed) {
    throw new Error("Summary cannot be empty.");
  }
  if (trimmed.length > 500) {
    throw new Error("Summary must be 500 characters or fewer.");
  }
  const row = await prisma.capability.update({
    where: { id },
    data: { summary: trimmed },
  });
  return {
    id: row.id,
    domain: toDomain(row),
    name: row.name,
    summary: row.summary,
    maturity: toMaturity(row),
    reuse: row.reuse,
    ownership: row.ownership ?? undefined,
  };
}
