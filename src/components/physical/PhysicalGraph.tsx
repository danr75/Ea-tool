"use client";

import { useMemo } from "react";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type {
  PhysicalComponent,
  PhysicalDependency,
  PhysicalDependencyKind,
  PhysicalHost,
} from "@/lib/types";
import {
  HostGroupNode,
  PhysicalNode,
  type PhysicalNodeData,
} from "./PhysicalNode";

const nodeTypes = { physical: PhysicalNode, hostGroup: HostGroupNode };

const depStyle: Record<
  PhysicalDependencyKind,
  { stroke: string; dashed?: boolean }
> = {
  calls: { stroke: "#5b8def" },
  reads: { stroke: "#94a3b8" },
  writes: { stroke: "#525a72" },
  publishes: { stroke: "#10b981" },
  consumes: { stroke: "#10b981", dashed: true },
  secures: { stroke: "#ef4444", dashed: true },
  hosts: { stroke: "#94a3b8", dashed: true },
};

const depLabel: Record<PhysicalDependencyKind, string> = {
  calls: "calls",
  reads: "reads",
  writes: "writes",
  publishes: "publishes",
  consumes: "consumes",
  secures: "secures",
  hosts: "hosts",
};

const HOST_ORDER: PhysicalHost[] = [
  "aws",
  "azure",
  "gcp",
  "saas",
  "on-prem",
  "edge",
];

const COL_W = 280;
const COL_PAD_X = 24;
const ROW_H = 150;
const HEADER_Y = 56;

export function PhysicalGraph({
  components,
  dependencies,
  selectedCapabilityId,
}: {
  components: PhysicalComponent[];
  dependencies: PhysicalDependency[];
  selectedCapabilityId: string;
}) {
  const { nodes, edges } = useMemo(() => {
    // Group by host and stable-sort: selected capability first within each host.
    const byHost: Record<string, PhysicalComponent[]> = {};
    for (const c of components) {
      (byHost[c.host] ??= []).push(c);
    }
    for (const host of Object.keys(byHost)) {
      byHost[host].sort((a, b) => {
        const aSel = a.capabilityId === selectedCapabilityId ? 0 : 1;
        const bSel = b.capabilityId === selectedCapabilityId ? 0 : 1;
        if (aSel !== bSel) return aSel - bSel;
        return a.name.localeCompare(b.name);
      });
    }

    const presentHosts = HOST_ORDER.filter((h) => byHost[h]?.length);

    const nodes: Node[] = [];

    presentHosts.forEach((host, i) => {
      const list = byHost[host];
      const colX = i * (COL_W + COL_PAD_X);
      const colHeight = HEADER_Y + list.length * ROW_H + 24;

      // Background group node (non-interactive)
      nodes.push({
        id: `host-${host}`,
        type: "hostGroup",
        position: { x: colX, y: 0 },
        data: { host, width: COL_W, height: colHeight },
        draggable: false,
        selectable: false,
        zIndex: -1,
      });

      list.forEach((c, j) => {
        nodes.push({
          id: c.id,
          type: "physical",
          position: { x: colX + 30, y: HEADER_Y + j * ROW_H },
          data: {
            label: c.name,
            vendor: c.vendor,
            description: c.description,
            kind: c.kind,
            host: c.host,
            inSelectedCapability: c.capabilityId === selectedCapabilityId,
          } satisfies PhysicalNodeData,
          draggable: true,
        });
      });
    });

    const presentIds = new Set(nodes.map((n) => n.id));
    const edges: Edge[] = dependencies
      .filter((d) => presentIds.has(d.from) && presentIds.has(d.to))
      .map((d, i) => {
        const style = depStyle[d.kind];
        return {
          id: `${d.from}-${d.to}-${i}`,
          source: d.from,
          target: d.to,
          label: d.label ?? depLabel[d.kind],
          labelStyle: { fontSize: 10, fill: "#525a72", fontWeight: 500 },
          labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
          labelBgPadding: [4, 2],
          labelBgBorderRadius: 4,
          style: {
            stroke: style.stroke,
            strokeWidth: 1.6,
            strokeDasharray: style.dashed ? "5 4" : undefined,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: style.stroke,
            width: 16,
            height: 16,
          },
          type: "default",
        };
      });

    return { nodes, edges };
  }, [components, dependencies, selectedCapabilityId]);

  return (
    <div className="h-[680px] rounded-2xl ring-1 ring-ink-100 bg-white shadow-card overflow-hidden">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.35}
          maxZoom={1.5}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} color="#e2e6f0" />
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
