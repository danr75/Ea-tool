"use client";

import { ArrowLeft, Server } from "lucide-react";
import type {
  Capability,
  PhysicalComponent,
  PhysicalDependency,
} from "@/lib/types";
import { domainsById } from "@/data/domains";
import { useArchitectureData } from "@/components/ArchitectureDataProvider";
import { PhysicalGraph } from "./PhysicalGraph";
import { physicalHostMeta, physicalKindMeta } from "./PhysicalNode";
import { PhysicalEditor } from "./PhysicalEditor";

function partitionDeps(
  deps: PhysicalDependency[],
  ids: Set<string>,
) {
  const internal: PhysicalDependency[] = [];
  const incoming: PhysicalDependency[] = [];
  const outgoing: PhysicalDependency[] = [];
  for (const d of deps) {
    const fromIn = ids.has(d.from);
    const toIn = ids.has(d.to);
    if (fromIn && toIn) internal.push(d);
    else if (toIn) incoming.push(d);
    else if (fromIn) outgoing.push(d);
  }
  return { internal, incoming, outgoing };
}

export function PhysicalView({
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
    physicalComponents,
    physicalDependencies,
    capabilitiesWithPhysical,
    logicalComponents,
  } = useArchitectureData();

  const logicalForCapability = capabilityId
    ? logicalComponents.filter((l) => l.capabilityId === capabilityId)
    : [];

  if (!capabilityId) {
    return (
      <PickCapability
        onPick={onPickCapability}
        capabilitiesWithPhysical={capabilitiesWithPhysical}
        capabilitiesById={capabilitiesById}
      />
    );
  }

  const cap = capabilitiesById[capabilityId];
  if (!cap)
    return (
      <PickCapability
        onPick={onPickCapability}
        capabilitiesWithPhysical={capabilitiesWithPhysical}
        capabilitiesById={capabilitiesById}
      />
    );

  const components = physicalComponents.filter(
    (c) => c.capabilityId === capabilityId,
  );
  const componentIds = new Set(components.map((c) => c.id));
  const { internal, incoming, outgoing } = partitionDeps(
    physicalDependencies,
    componentIds,
  );

  const allDeps = [...internal, ...incoming, ...outgoing];
  const neighbourIds = new Set<string>();
  for (const d of [...incoming, ...outgoing]) {
    neighbourIds.add(d.from);
    neighbourIds.add(d.to);
  }
  for (const c of components) neighbourIds.delete(c.id);

  const allComponents: PhysicalComponent[] = [
    ...components,
    ...Array.from(neighbourIds)
      .map((id) => physicalComponents.find((c) => c.id === id))
      .filter((c): c is PhysicalComponent => Boolean(c)),
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
            {cap.name} · physical view
          </h2>
        </div>
        <CapabilityPicker
          current={capabilityId}
          onPick={onPickCapability}
          capabilitiesWithPhysical={capabilitiesWithPhysical}
          capabilitiesById={capabilitiesById}
        />
      </div>

      <p className="text-sm text-ink-500 leading-relaxed max-w-3xl">
        The specific products and instances that implement this capability,
        grouped by hosting environment. Cross-capability dependencies are
        included so you can see how this footprint connects to the rest of the
        estate.
      </p>

      <Legend />

      {components.length > 0 ? (
        <PhysicalGraph
          components={allComponents}
          dependencies={allDeps}
          selectedCapabilityId={capabilityId}
        />
      ) : (
        <div className="bg-white rounded-2xl ring-1 ring-dashed ring-ink-200 p-10 text-center">
          <p className="text-sm text-ink-500">
            No physical components yet for{" "}
            <span className="font-medium text-ink-900">{cap.name}</span>. Add
            one below to start the graph.
          </p>
        </div>
      )}

      <PhysicalEditor
        capabilityId={capabilityId}
        components={components}
        dependencies={physicalDependencies}
        logicalForCapability={logicalForCapability}
      />
    </div>
  );
}

function PickCapability({
  onPick,
  capabilitiesWithPhysical,
  capabilitiesById,
}: {
  onPick: (id: string) => void;
  capabilitiesWithPhysical: string[];
  capabilitiesById: Record<string, Capability>;
}) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-8">
      <div className="max-w-2xl">
        <span className="w-10 h-10 rounded-xl bg-ink-900 text-white grid place-items-center">
          <Server size={18} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-ink-900">
          Pick a capability to open at the physical layer
        </h2>
        <p className="mt-1.5 text-sm text-ink-500">
          The physical view shows the actual products and instances that
          implement a capability, grouped by hosting environment.
        </p>
      </div>
      <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
        {capabilitiesWithPhysical.map((id) => {
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

function NoPhysicalContent({
  capability,
  onPick,
  onBack,
  capabilitiesWithPhysical,
  capabilitiesById,
}: {
  capability: Capability;
  onPick: (id: string) => void;
  onBack: () => void;
  capabilitiesWithPhysical: string[];
  capabilitiesById: Record<string, Capability>;
}) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-dashed ring-ink-200 p-8 max-w-3xl">
      <span className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
        Physical view
      </span>
      <h2 className="mt-1 text-lg font-semibold text-ink-900">
        Not yet authored for {capability.name}
      </h2>
      <p className="mt-2 text-sm text-ink-500 leading-relaxed">
        The physical-layer footprint for this capability hasn&rsquo;t been
        seeded in this vertical slice. In production every capability would
        have its products and instances catalogued here.
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
          {capabilitiesWithPhysical.map((id) => {
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
  capabilitiesWithPhysical,
  capabilitiesById,
}: {
  current: string;
  onPick: (id: string) => void;
  capabilitiesWithPhysical: string[];
  capabilitiesById: Record<string, Capability>;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-400 font-medium">
        Open
      </span>
      {capabilitiesWithPhysical.map((id) => {
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
  const kinds = Object.entries(physicalKindMeta);
  const hosts = Object.entries(physicalHostMeta);
  return (
    <div className="flex flex-col gap-2 text-[11px] text-ink-600 bg-white rounded-xl ring-1 ring-ink-100 shadow-card px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="uppercase tracking-[0.14em] font-semibold text-ink-400">
          Hosting
        </span>
        {hosts.map(([id, m]) => (
          <span key={id} className="inline-flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm ring-1"
              style={{ background: m.bg, borderColor: m.ring }}
            />
            <span className="font-medium">{m.label}</span>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="uppercase tracking-[0.14em] font-semibold text-ink-400">
          Component kind
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
      </div>
    </div>
  );
}
