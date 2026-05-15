import { prisma } from "@/lib/prisma";
import type {
  LogicalComponent,
  LogicalComponentKind,
  LogicalFlow,
  LogicalFlowKind,
} from "@/lib/types";

function toComponent(row: {
  id: string;
  capabilityId: string;
  name: string;
  kind: string;
  description: string | null;
}): LogicalComponent {
  return {
    id: row.id,
    capabilityId: row.capabilityId,
    name: row.name,
    kind: row.kind as LogicalComponentKind,
    description: row.description ?? undefined,
  };
}

function toFlow(row: {
  fromId: string;
  toId: string;
  kind: string;
  label: string | null;
}): LogicalFlow {
  return {
    from: row.fromId,
    to: row.toId,
    kind: row.kind as LogicalFlowKind,
    label: row.label ?? undefined,
  };
}

export async function getAllLogical(): Promise<{
  components: LogicalComponent[];
  flows: LogicalFlow[];
}> {
  const [components, flows] = await Promise.all([
    prisma.logicalComponent.findMany({ orderBy: { name: "asc" } }),
    prisma.logicalFlow.findMany(),
  ]);
  return {
    components: components.map(toComponent),
    flows: flows.map(toFlow),
  };
}

function slugifyComponent(capabilityId: string, name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const capPrefix = capabilityId.replace(/^cap-/, "").slice(0, 16);
  return `lc-${capPrefix}-${slug}`;
}

export async function createLogicalComponent(input: {
  capabilityId: string;
  name: string;
  kind: LogicalComponentKind;
  description?: string;
}): Promise<LogicalComponent> {
  const name = input.name.trim();
  if (!name) throw new Error("Name cannot be empty.");
  if (name.length > 80) throw new Error("Name must be 80 characters or fewer.");
  const description = input.description?.trim() || null;

  const baseId = slugifyComponent(input.capabilityId, name);
  let id = baseId;
  let attempt = 1;
  while (await prisma.logicalComponent.findUnique({ where: { id } })) {
    attempt += 1;
    id = `${baseId}-${attempt}`;
    if (attempt > 50) throw new Error("Could not generate a unique id.");
  }

  const row = await prisma.logicalComponent.create({
    data: {
      id,
      capabilityId: input.capabilityId,
      name,
      kind: input.kind,
      description,
    },
  });
  return toComponent(row);
}

export async function deleteLogicalComponent(id: string): Promise<void> {
  await prisma.logicalComponent.delete({ where: { id } });
}

export async function updateLogicalComponent(
  id: string,
  patch: {
    name?: string;
    kind?: LogicalComponentKind;
    description?: string | null;
  },
): Promise<LogicalComponent> {
  const data: Record<string, unknown> = {};
  if (patch.name !== undefined) {
    const trimmed = patch.name.trim();
    if (!trimmed) throw new Error("Name cannot be empty.");
    if (trimmed.length > 80)
      throw new Error("Name must be 80 characters or fewer.");
    data.name = trimmed;
  }
  if (patch.kind !== undefined) data.kind = patch.kind;
  if (patch.description !== undefined) {
    const trimmed = patch.description?.trim() ?? "";
    data.description = trimmed || null;
  }
  const row = await prisma.logicalComponent.update({
    where: { id },
    data,
  });
  return toComponent(row);
}

export async function createLogicalFlow(input: {
  from: string;
  to: string;
  kind: LogicalFlowKind;
  label?: string;
}): Promise<LogicalFlow> {
  if (input.from === input.to) {
    throw new Error("A flow can't connect a component to itself.");
  }
  const label = input.label?.trim() || null;
  try {
    const row = await prisma.logicalFlow.create({
      data: {
        fromId: input.from,
        toId: input.to,
        kind: input.kind,
        label,
      },
    });
    return toFlow(row);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Unique constraint")) {
      throw new Error("That flow already exists.");
    }
    throw e;
  }
}

export async function deleteLogicalFlow(input: {
  from: string;
  to: string;
  kind: LogicalFlowKind;
}): Promise<void> {
  await prisma.logicalFlow.deleteMany({
    where: { fromId: input.from, toId: input.to, kind: input.kind },
  });
}
