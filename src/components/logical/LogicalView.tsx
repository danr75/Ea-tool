"use client";

import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import type {
  Capability,
  LogicalComponent,
  LogicalFlow,
} from "@/lib/types";
import { domainsById } from "@/data/domains";
import { useArchitectureData } from "@/components/ArchitectureDataProvider";
import { LogicalGraph } from "./LogicalGraph";
import { logicalNodeKindMeta } from "./LogicalNode";

function partitionFlows(
  flows: LogicalFlow[],
  componentIds: Set<string>,
) {
  const internal: LogicalFlow[] = [];
  const incoming: LogicalFlow[] = [];
  const outgoing: LogicalFlow[] = [];
  for (const f of flows) {
    const fromIn = componentIds.has(f.from);
    const toIn = componentIds.has(f.to);
    if (fromIn && toIn) internal.push(f);
    else if (toIn) incoming.push(f);
    else if (fromIn) outgoing.push(f);
  }
  return { internal, incoming, outgoing };
}

export function LogicalView({
  capabilityId,
  onPickCapability,
  onBackToConceptual,
}: {
  capabilityId: string | null;
  onPickCapability: (id: string) => void;
  onBackToConceptual: () => void;
}) {
  const {
    capabilitiesById,
    logicalComponents,
    logicalFlows,
    capabilitiesWithLogical,
  } = useArchitectureData();

  if (!capabilityId) {
    return (
      <PickCapability
        onPick={onPickCapability}
        capabilitiesWithLogical={capabilitiesWithLogical}
        capabilitiesById={capabilitiesById}
      />
    );
  }

  const cap = capabilitiesById[capabilityId];
  if (!cap)
    return (
      <PickCapability
        onPick={onPickCapability}
        capabilitiesWithLogical={capabilitiesWithLogical}
        capabilitiesById={capabilitiesById}
      />
    );

  const components = logicalComponents.filter(
    (c) => c.capabilityId === capabilityId,
  );
  const componentIds = new Set(components.map((c) => c.id));
  const { internal, incoming, outgoing } = partitionFlows(
    logicalFlows,
    componentIds,
  );

  if (components.length === 0) {
    return (
      <NoLogicalContent
        capability={cap}
        onPick={onPickCapability}
        onBack={onBackToConceptual}
        capabilitiesWithLogical={capabilitiesWithLogical}
        capabilitiesById={capabilitiesById}
      />
    );
  }

  const allFlows = [...internal, ...incoming, ...outgoing];

  // Bring in cross-capability components so they can render in the graph.
  const neighbourIds = new Set<string>();
  for (const f of [...incoming, ...outgoing]) {
    neighbourIds.add(f.from);
    neighbourIds.add(f.to);
  }
  for (const c of components) neighbourIds.delete(c.id);

  const allComponents: LogicalComponent[] = [
    ...components,
    ...Array.from(neighbourIds)
      .map((id) => logicalComponents.find((c) => c.id === id))
      .filter((c): c is LogicalComponent => Boolean(c)),
  ];

  const domain = domainsById[cap.domain];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToConceptual}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-900"
          >
            <ArrowLeft size={12} />
            Back to capability map
          </button>
          <span className="text-ink-200">·</span>
          <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: domain.accent }}
            />
            {domain.name}
          </span>
          <h2 className="text-base font-semibold text-ink-900">
            {cap.name} · logical view
          </h2>
        </div>
        <CapabilityPicker
          current={capabilityId}
          onPick={onPickCapability}
          capabilitiesWithLogical={capabilitiesWithLogical}
          capabilitiesById={capabilitiesById}
        />
      </div>

      <p className="text-sm text-ink-500 leading-relaxed max-w-3xl">
        {cap.summary} The graph below shows the services, platforms, data
        stores and policy points that implement this capability — plus any
        cross-capability dependencies it relies on. Drag nodes to rearrange.
      </p>

      <Legend />

      <LogicalGraph
        components={allComponents}
        flows={allFlows}
        selectedCapabilityId={capabilityId}
      />

      <CrossCapabilityBridges
        flows={[...incoming, ...outgoing]}
        logicalComponents={logicalComponents}
        capabilitiesById={capabilitiesById}
      />
    </div>
  );
}

function PickCapability({
  onPick,
  capabilitiesWithLogical,
  capabilitiesById,
}: {
  onPick: (id: string) => void;
  capabilitiesWithLogical: string[];
  capabilitiesById: Record<string, Capability>;
}) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-8">
      <div className="max-w-2xl">
        <span className="w-10 h-10 rounded-xl bg-ink-900 text-white grid place-items-center">
          <Layers size={18} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-ink-900">
          Pick a capability to open at the logical layer
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          The logical view decomposes a capability into the services, data
          stores and integration points that implement it. Six capabilities
          have been authored in this slice.
        </p>
      </div>
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
        {capabilitiesWithLogical.map((id) => {
          const c = capabilitiesById[id];
          if (!c) return null;
          const d = domainsById[c.domain];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onPick(id)}
              className="text-left p-4 rounded-xl ring-1 ring-ink-100 hover:ring-ink-300/60 hover:shadow-card transition-all bg-white"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: d.accent }}
                />
                {d.name}
              </div>
              <div className="mt-2 text-sm font-semibold text-ink-900">
                {c.name}
              </div>
              <p className="mt-1 text-xs text-ink-500 line-clamp-2">
                {c.summary}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function NoLogicalContent({
  capability,
  onPick,
  onBack,
  capabilitiesWithLogical,
  capabilitiesById,
}: {
  capability: Capability;
  onPick: (id: string) => void;
  onBack: () => void;
  capabilitiesWithLogical: string[];
  capabilitiesById: Record<string, Capability>;
}) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-dashed ring-ink-200 p-8 max-w-3xl">
      <span className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
        Logical view
      </span>
      <h2 className="mt-1 text-lg font-semibold text-ink-900">
        Not yet authored for {capability.name}
      </h2>
      <p className="mt-2 text-sm text-ink-500 leading-relaxed">
        The logical-layer model for this capability hasn&rsquo;t been seeded in
        this vertical slice. In production every capability would have its
        services, data stores and flows defined here.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-medium px-3 py-1.5 rounded-md ring-1 ring-ink-200 text-ink-700 hover:bg-ink-100"
        >
          Back to capability map
        </button>
        <div className="text-xs text-ink-500">
          Or open one of the authored capabilities:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {capabilitiesWithLogical.map((id) => {
            const c = capabilitiesById[id];
            if (!c) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onPick(id)}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-ink-100 text-ink-700 hover:bg-ink-900 hover:text-white transition-colors"
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CapabilityPicker({
  current,
  onPick,
  capabilitiesWithLogical,
  capabilitiesById,
}: {
  current: string;
  onPick: (id: string) => void;
  capabilitiesWithLogical: string[];
  capabilitiesById: Record<string, Capability>;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-400 font-medium">
        Open
      </span>
      {capabilitiesWithLogical.map((id) => {
        const c = capabilitiesById[id];
        if (!c) return null;
        const active = id === current;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onPick(id)}
            className={[
              "text-xs font-medium px-2.5 py-1 rounded-full transition-colors",
              active
                ? "bg-ink-900 text-white"
                : "bg-ink-100 text-ink-600 hover:text-ink-900",
            ].join(" ")}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}

function Legend() {
  const kinds = Object.entries(logicalNodeKindMeta);
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-600 bg-white rounded-xl ring-1 ring-ink-100 shadow-card px-4 py-2.5">
      <span className="uppercase tracking-[0.14em] font-semibold text-ink-400">
        Components
      </span>
      {kinds.map(([id, m]) => (
        <span key={id} className="inline-flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-sm ring-1"
            style={{ background: m.bg, borderColor: m.ring }}
          />
          <span className="font-medium">{m.label}</span>
        </span>
      ))}
      <span className="ml-auto text-ink-400 text-[10px]">
        Dashed lines · enforces/consumes · solid · calls/reads/writes
      </span>
    </div>
  );
}

function CrossCapabilityBridges({
  flows,
  logicalComponents,
  capabilitiesById,
}: {
  flows: { from: string; to: string; label?: string }[];
  logicalComponents: LogicalComponent[];
  capabilitiesById: Record<string, Capability>;
}) {
  if (flows.length === 0) return null;
  const componentById = Object.fromEntries(
    logicalComponents.map((c) => [c.id, c]),
  );
  return (
    <section className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5">
      <h3 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold mb-3">
        Cross-capability dependencies
      </h3>
      <ul className="space-y-2">
        {flows.map((f, i) => {
          const fromC = componentById[f.from];
          const toC = componentById[f.to];
          if (!fromC || !toC) return null;
          const fromCap = capabilitiesById[fromC.capabilityId];
          const toCap = capabilitiesById[toC.capabilityId];
          return (
            <li
              key={`${f.from}-${f.to}-${i}`}
              className="flex items-center gap-2 text-sm flex-wrap"
            >
              <Tag name={fromC.name} cap={fromCap?.name} />
              <span className="text-ink-400 text-xs">→ {f.label ?? "uses"}</span>
              <Tag name={toC.name} cap={toCap?.name} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Tag({ name, cap }: { name: string; cap?: string }) {
  return (
    <span className="inline-flex flex-col bg-ink-50 ring-1 ring-ink-100 rounded-md px-2 py-0.5">
      <span className="text-[9px] uppercase tracking-wider text-ink-400 leading-tight">
        {cap}
      </span>
      <span className="text-xs font-medium text-ink-900 leading-tight">
        {name}
      </span>
    </span>
  );
}
