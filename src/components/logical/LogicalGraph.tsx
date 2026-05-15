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
  LogicalComponent,
  LogicalFlow,
  LogicalFlowKind,
} from "@/lib/types";
import { LogicalNode, type LogicalNodeData } from "./LogicalNode";

const nodeTypes = { logical: LogicalNode };

const flowStyle: Record<LogicalFlowKind, { stroke: string; dashed?: boolean }> = {
  calls: { stroke: "#5b8def" },
  publishes: { stroke: "#10b981" },
  consumes: { stroke: "#10b981", dashed: true },
  reads: { stroke: "#94a3b8" },
  writes: { stroke: "#525a72" },
  enforces: { stroke: "#ef4444", dashed: true },
};

const flowLabel: Record<LogicalFlowKind, string> = {
  calls: "calls",
  publishes: "publishes",
  consumes: "consumes",
  reads: "reads",
  writes: "writes",
  enforces: "enforces",
};

export function LogicalGraph({
  components,
  flows,
  selectedCapabilityId,
}: {
  components: LogicalComponent[];
  flows: LogicalFlow[];
  selectedCapabilityId: string;
}) {
  const { nodes, edges } = useMemo(() => {
    // Group components by capability, then lay out left-to-right by kind.
    const kindOrder = [
      "external",
      "interface",
      "service",
      "platform",
      "datastore",
      "policy",
    ];
    const byKindIndex = (k: string) => kindOrder.indexOf(k);

    // Place selected capability components in main column band; others in side bands.
    const selected = components.filter(
      (c) => c.capabilityId === selectedCapabilityId,
    );
    const others = components.filter(
      (c) => c.capabilityId !== selectedCapabilityId,
    );

    const colX = [60, 280, 500, 720, 940, 1160];

    // Column buckets for the selected capability.
    const buckets: Record<string, LogicalComponent[]> = {};
    for (const c of selected) {
      const idx = Math.max(0, byKindIndex(c.kind));
      (buckets[idx] ??= []).push(c);
    }

    const ROW_H = 130;

    const nodes: Node<LogicalNodeData>[] = [];

    // Selected capability nodes laid out by column.
    for (const idxStr of Object.keys(buckets)) {
      const idx = Number(idxStr);
      const list = buckets[idxStr];
      const colCount = list.length;
      list.forEach((c, i) => {
        const y = 80 + (i - (colCount - 1) / 2) * ROW_H;
        nodes.push({
          id: c.id,
          type: "logical",
          position: { x: colX[idx], y },
          data: {
            label: c.name,
            description: c.description,
            kind: c.kind,
            inSelectedCapability: true,
          },
          draggable: true,
        });
      });
    }

    // Cross-capability neighbours that show up in flows — stack along the bottom.
    const flowIds = new Set<string>();
    for (const f of flows) {
      flowIds.add(f.from);
      flowIds.add(f.to);
    }
    const neighbours = others.filter((c) => flowIds.has(c.id));
    neighbours.forEach((c, i) => {
      const cols = Math.min(6, neighbours.length);
      const col = i % cols;
      const row = Math.floor(i / cols);
      nodes.push({
        id: c.id,
        type: "logical",
        position: { x: 60 + col * 220, y: 560 + row * 130 },
        data: {
          label: c.name,
          description: c.description,
          kind: c.kind,
          inSelectedCapability: false,
        },
        draggable: true,
      });
    });

    const presentIds = new Set(nodes.map((n) => n.id));
    const edges: Edge[] = flows
      .filter((f) => presentIds.has(f.from) && presentIds.has(f.to))
      .map((f, i) => {
        const style = flowStyle[f.kind];
        return {
          id: `${f.from}-${f.to}-${i}`,
          source: f.from,
          target: f.to,
          label: f.label ?? flowLabel[f.kind],
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
  }, [components, flows, selectedCapabilityId]);

  return (
    <div className="h-[640px] rounded-2xl ring-1 ring-ink-100 bg-white shadow-card overflow-hidden">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.4}
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
