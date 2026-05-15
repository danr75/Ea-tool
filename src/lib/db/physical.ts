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
