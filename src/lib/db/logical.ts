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
