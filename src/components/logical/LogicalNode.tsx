"use client";

import { Handle, Position } from "@xyflow/react";
import {
  Box,
  Cloud,
  Cog,
  Database,
  ExternalLink,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { LogicalComponentKind } from "@/lib/types";

const kindMeta: Record<
  LogicalComponentKind,
  { label: string; icon: LucideIcon; color: string; bg: string; ring: string }
> = {
  service: {
    label: "Service",
    icon: Cog,
    color: "#2d59c2",
    bg: "#dbe6ff",
    ring: "#5b8def",
  },
  platform: {
    label: "Platform",
    icon: Cloud,
    color: "#7c2d12",
    bg: "#fed7aa",
    ring: "#f59e0b",
  },
  datastore: {
    label: "Data store",
    icon: Database,
    color: "#065f46",
    bg: "#a7f3d0",
    ring: "#10b981",
  },
  interface: {
    label: "Interface",
    icon: Box,
    color: "#581c87",
    bg: "#e9d5ff",
    ring: "#a855f7",
  },
  external: {
    label: "External",
    icon: ExternalLink,
    color: "#525a72",
    bg: "#eceef5",
    ring: "#94a3b8",
  },
  policy: {
    label: "Policy",
    icon: Shield,
    color: "#991b1b",
    bg: "#fecaca",
    ring: "#ef4444",
  },
};

export type LogicalNodeData = {
  label: string;
  description?: string;
  kind: LogicalComponentKind;
  inSelectedCapability: boolean;
};

export function LogicalNode({ data }: { data: LogicalNodeData }) {
  const m = kindMeta[data.kind];
  const Icon = m.icon;
  return (
    <div
      className="relative rounded-xl shadow-card transition-shadow hover:shadow-pop"
      style={{
        background: "white",
        border: `1.5px solid ${m.ring}`,
        opacity: data.inSelectedCapability ? 1 : 0.55,
        minWidth: 180,
        maxWidth: 220,
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: m.ring, width: 8, height: 8, border: "none" }}
      />
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-md grid place-items-center shrink-0"
            style={{ background: m.bg, color: m.color }}
          >
            <Icon size={13} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold leading-none" style={{ color: m.color }}>
              {m.label}
            </div>
            <div className="text-[13px] font-semibold text-ink-900 leading-tight mt-0.5 truncate">
              {data.label}
            </div>
          </div>
        </div>
        {data.description && (
          <div className="text-[11px] text-ink-500 leading-snug mt-1.5">
            {data.description}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: m.ring, width: 8, height: 8, border: "none" }}
      />
    </div>
  );
}

export const logicalNodeKindMeta = kindMeta;
