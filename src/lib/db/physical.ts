import { prisma } from "@/lib/prisma";
import type {
  PhysicalComponent,
  PhysicalDependency,
  PhysicalDependencyKind,
  PhysicalHost,
  PhysicalKind,
} from "@/lib/types";

function toComponent(row: {
  id: string;
  capabilityId: string;
  logicalComponentId: string | null;
  name: string;
  vendor: string | null;
  kind: string;
  host: string;
  description: string | null;
}): PhysicalComponent {
  return {
    id: row.id,
    capabilityId: row.capabilityId,
    logicalComponentId: row.logicalComponentId ?? undefined,
    name: row.name,
    vendor: row.vendor ?? undefined,
    kind: row.kind as PhysicalKind,
    host: row.host as PhysicalHost,
    description: row.description ?? undefined,
  };
}

function toDependency(row: {
  fromId: string;
  toId: string;
  kind: string;
  label: string | null;
}): PhysicalDependency {
  return {
    from: row.fromId,
    to: row.toId,
    kind: row.kind as PhysicalDependencyKind,
    label: row.label ?? undefined,
  };
}

export async function getAllPhysical(): Promise<{
  components: PhysicalComponent[];
  dependencies: PhysicalDependency[];
}> {
  const [components, dependencies] = await Promise.all([
    prisma.physicalComponent.findMany({ orderBy: { name: "asc" } }),
    prisma.physicalDependency.findMany(),
  ]);
  return {
    components: components.map(toComponent),
    dependencies: dependencies.map(toDependency),
  };
}

function slugifyComponent(capabilityId: string, name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const capPrefix = capabilityId.replace(/^cap-/, "").slice(0, 16);
  return `px-${capPrefix}-${slug}`;
}

export async function createPhysicalComponent(input: {
  capabilityId: string;
  name: string;
  kind: PhysicalKind;
  host: PhysicalHost;
  vendor?: string;
  description?: string;
  logicalComponentId?: string;
}): Promise<PhysicalComponent> {
  const name = input.name.trim();
  if (!name) throw new Error("Name cannot be empty.");
  if (name.length > 80) throw new Error("Name must be 80 characters or fewer.");
  const vendor = input.vendor?.trim() || null;
  const description = input.description?.trim() || null;
  const logicalComponentId = input.logicalComponentId?.trim() || null;

  const baseId = slugifyComponent(input.capabilityId, name);
  let id = baseId;
  let attempt = 1;
  while (await prisma.physicalComponent.findUnique({ where: { id } })) {
    attempt += 1;
    id = `${baseId}-${attempt}`;
    if (attempt > 50) throw new Error("Could not generate a unique id.");
  }

  const row = await prisma.physicalComponent.create({
    data: {
      id,
      capabilityId: input.capabilityId,
      name,
      kind: input.kind,
      host: input.host,
      vendor,
      description,
      logicalComponentId,
    },
  });
  return toComponent(row);
}

export async function deletePhysicalComponent(id: string): Promise<void> {
  await prisma.physicalComponent.delete({ where: { id } });
}

export async function createPhysicalDependency(input: {
  from: string;
  to: string;
  kind: PhysicalDependencyKind;
  label?: string;
}): Promise<PhysicalDependency> {
  if (input.from === input.to) {
    throw new Error("A dependency can't connect a component to itself.");
  }
  const label = input.label?.trim() || null;
  try {
    const row = await prisma.physicalDependency.create({
      data: {
        fromId: input.from,
        toId: input.to,
        kind: input.kind,
        label,
      },
    });
    return toDependency(row);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      throw new Error("That dependency already exists.");
    }
    throw e;
  }
}

export async function deletePhysicalDependency(input: {
  from: string;
  to: string;
  kind: PhysicalDependencyKind;
}): Promise<void> {
  await prisma.physicalDependency.deleteMany({
    where: { fromId: input.from, toId: input.to, kind: input.kind },
  });
}
