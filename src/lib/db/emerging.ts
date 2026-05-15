import { prisma } from "@/lib/prisma";
import type {
  AdoptionHorizon,
  CapabilityImpact,
  EmergingCapability,
  ImpactKind,
  MaturityLevel,
} from "@/lib/types";

type DbSignal = {
  id: string;
  name: string;
  summary: string;
  category: string;
  horizon: string;
  likelihood: number;
  impact: number;
  urgency: number;
  maturity: string;
  industries: string;
  opportunities: string;
  risks: string;
  migrationPath: string;
  governanceShifts: string;
  workforceShifts: string;
  impacts: { capabilityId: string; kind: string; note: string }[];
};

function parseList(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function toEmerging(row: DbSignal): EmergingCapability {
  return {
    id: row.id,
    name: row.name,
    summary: row.summary,
    category: row.category,
    horizon: row.horizon as AdoptionHorizon,
    likelihood: row.likelihood,
    impact: row.impact,
    urgency: row.urgency,
    maturity: row.maturity as MaturityLevel,
    industries: parseList(row.industries),
    opportunities: parseList(row.opportunities),
    risks: parseList(row.risks),
    migrationPath: parseList(row.migrationPath),
    governanceShifts: parseList(row.governanceShifts),
    workforceShifts: parseList(row.workforceShifts),
    impacts: row.impacts.map(
      (i): CapabilityImpact => ({
        capabilityId: i.capabilityId,
        kind: i.kind as ImpactKind,
        note: i.note,
      }),
    ),
  };
}

export async function getAllEmerging(): Promise<EmergingCapability[]> {
  const rows = await prisma.emergingCapability.findMany({
    include: { impacts: true },
    orderBy: { name: "asc" },
  });
  return rows.map(toEmerging);
}

export async function getEmergingById(
  id: string,
): Promise<EmergingCapability | null> {
  const row = await prisma.emergingCapability.findUnique({
    where: { id },
    include: { impacts: true },
  });
  return row ? toEmerging(row) : null;
}

function slugify(name: string) {
  return (
    "em-" +
    name
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48)
  );
}

interface NewSignal {
  name: string;
  summary: string;
  category: string;
  horizon: AdoptionHorizon;
  likelihood: number;
  impact: number;
  urgency: number;
  maturity: MaturityLevel;
}

export async function createEmerging(input: NewSignal): Promise<EmergingCapability> {
  const name = input.name.trim();
  if (!name) throw new Error("Name cannot be empty.");
  if (name.length > 100) throw new Error("Name must be 100 characters or fewer.");
  for (const score of [input.likelihood, input.impact, input.urgency]) {
    if (score < 0 || score > 1) throw new Error("Scores must be between 0 and 1.");
  }

  const baseId = slugify(name);
  let id = baseId;
  let attempt = 1;
  while (await prisma.emergingCapability.findUnique({ where: { id } })) {
    attempt += 1;
    id = `${baseId}-${attempt}`;
    if (attempt > 50) throw new Error("Could not generate a unique id.");
  }

  const row = await prisma.emergingCapability.create({
    data: {
      id,
      name,
      summary: input.summary.trim() || "No summary yet.",
      category: input.category.trim() || "Uncategorised",
      horizon: input.horizon,
      likelihood: input.likelihood,
      impact: input.impact,
      urgency: input.urgency,
      maturity: input.maturity,
      industries: JSON.stringify([]),
      opportunities: JSON.stringify([]),
      risks: JSON.stringify([]),
      migrationPath: JSON.stringify([]),
      governanceShifts: JSON.stringify([]),
      workforceShifts: JSON.stringify([]),
    },
    include: { impacts: true },
  });
  return toEmerging(row);
}

export async function updateEmerging(
  id: string,
  patch: Partial<NewSignal>,
): Promise<EmergingCapability> {
  const data: Record<string, unknown> = {};
  if (patch.name !== undefined) {
    const trimmed = patch.name.trim();
    if (!trimmed) throw new Error("Name cannot be empty.");
    data.name = trimmed;
  }
  if (patch.summary !== undefined) data.summary = patch.summary.trim();
  if (patch.category !== undefined) data.category = patch.category.trim() || "Uncategorised";
  if (patch.horizon !== undefined) data.horizon = patch.horizon;
  if (patch.maturity !== undefined) data.maturity = patch.maturity;
  for (const key of ["likelihood", "impact", "urgency"] as const) {
    const v = patch[key];
    if (v !== undefined) {
      if (v < 0 || v > 1) throw new Error("Scores must be between 0 and 1.");
      data[key] = v;
    }
  }
  const row = await prisma.emergingCapability.update({
    where: { id },
    data,
    include: { impacts: true },
  });
  return toEmerging(row);
}

export async function deleteEmerging(id: string): Promise<void> {
  await prisma.emergingCapability.delete({ where: { id } });
}
