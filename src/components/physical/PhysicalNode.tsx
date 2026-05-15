"use client";

import { Handle, Position } from "@xyflow/react";
import {
  Box,
  Cpu,
  Database,
  Globe,
  MessageSquare,
  Server,
  Shield,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import type { PhysicalHost, PhysicalKind } from "@/lib/types";

export const physicalKindMeta: Record<
  PhysicalKind,
  { label: string; icon: LucideIcon; color: string; bg: string; ring: string }
> = {
  compute: {
    label: "Compute",
    icon: Cpu,
    color: "#2d59c2",
    bg: "#dbe6ff",
    ring: "#5b8def",
  },
  datastore: {
    label: "Data store",
    icon: Database,
    color: "#065f46",
    bg: "#a7f3d0",
    ring: "#10b981",
  },
  platform: {
    label: "Platform",
    icon: Server,
    color: "#7c2d12",
    bg: "#fed7aa",
    ring: "#f59e0b",
  },
  "saas-app": {
    label: "SaaS",
    icon: Globe,
    color: "#581c87",
    bg: "#e9d5ff",
    ring: "#a855f7",
  },
  gateway: {
    label: "Gateway",
    icon: Box,
    color: "#0e7490",
    bg: "#cffafe",
    ring: "#06b6d4",
  },
  messaging: {
    label: "Messaging",
    icon: MessageSquare,
    color: "#3730a3",
    bg: "#e0e7ff",
    ring: "#6366f1",
  },
  security: {
    label: "Security",
    icon: Shield,
    color: "#991b1b",
    bg: "#fecaca",
    ring: "#ef4444",
  },
  device: {
    label: "Device",
    icon: Smartphone,
    color: "#525a72",
    bg: "#eceef5",
    ring: "#94a3b8",
  },
};

export const physicalHostMeta: Record<
  PhysicalHost,
  { label: string; tone: string; ring: string; bg: string }
> = {
  aws: { label: "AWS", tone: "#f59e0b", ring: "#fb923c", bg: "#fff7ed" },
  azure: { label: "Azure", tone: "#0ea5e9", ring: "#38bdf8", bg: "#eff6ff" },
  gcp: { label: "GCP", tone: "#22c55e", ring: "#4ade80", bg: "#f0fdf4" },
  saas: { label: "SaaS", tone: "#a855f7", ring: "#c084fc", bg: "#faf5ff" },
  "on-prem": {
    label: "On-prem",
    tone: "#525a72",
    ring: "#94a3b8",
    bg: "#f6f7fb",
  },
  edge: { label: "Edge", tone: "#ef4444", ring: "#f87171", bg: "#fef2f2" },
};

export type PhysicalNodeData = {
  label: string;
  vendor?: string;
  description?: string;
  kind: PhysicalKind;
  host: PhysicalHost;
  inSelectedCapability: boolean;
};

export function PhysicalNode({ data }: { data: PhysicalNodeData }) {
  const m = physicalKindMeta[data.kind];
  const Icon = m.icon;
  return (
    <div
      className="relative rounded-xl shadow-card transition-shadow hover:shadow-pop"
      style={{
        background: "white",
        border: `1.5px solid ${m.ring}`,
        opacity: data.inSelectedCapability ? 1 : 0.55,
        minWidth: 200,
        maxWidth: 240,
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
            <div
              className="text-[10px] uppercase tracking-wider font-semibold leading-none"
              style={{ color: m.color }}
            >
              {m.label}
            </div>
            <div className="text-[13px] font-semibold text-ink-900 leading-tight mt-0.5 truncate">
              {data.label}
            </div>
          </div>
        </div>
        {data.vendor && (
          <div className="text-[10px] text-ink-500 mt-1.5 truncate">
            {data.vendor}
          </div>
        )}
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

export function HostGroupNode({
  data,
}: {
  data: { host: PhysicalHost; width: number; height: number };
}) {
  const meta = physicalHostMeta[data.host];
  return (
    <div
      className="rounded-2xl"
      style={{
        width: data.width,
        height: data.height,
        background: meta.bg,
        border: `1.5px dashed ${meta.ring}`,
      }}
    >
      <div
        className="absolute top-2 left-3 text-[10px] uppercase tracking-[0.14em] font-semibold px-2 py-0.5 rounded-full"
        style={{ color: meta.tone, background: "white" }}
      >
        {meta.label}
      </div>
    </div>
  );
}
