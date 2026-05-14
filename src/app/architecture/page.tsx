"use client";

import { useMemo, useState } from "react";
import type { AppMode, ViewLevel } from "@/lib/types";
import { capabilities } from "@/data/capabilities";
import { domains } from "@/data/domains";
import { emergingCapabilities } from "@/data/emerging";
import { relationships } from "@/data/relationships";
import { ModeSwitcher } from "@/components/shell/ModeSwitcher";
import { ViewSwitcher } from "@/components/shell/ViewSwitcher";
import { DomainColumn } from "@/components/conceptual/DomainColumn";
import { CapabilityDetail } from "@/components/conceptual/CapabilityDetail";

export default function ArchitecturePage() {
  const [mode, setMode] = useState<AppMode>("executive");
  const [view, setView] = useState<ViewLevel>("conceptual");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const emergingByCapability = useMemo(() => {
    const map: Record<string, typeof emergingCapabilities> = {};
    for (const e of emergingCapabilities) {
      for (const imp of e.impacts) {
        (map[imp.capabilityId] ??= []).push(e);
      }
    }
    return map;
  }, []);

  const capsByDomain = useMemo(() => {
    return Object.fromEntries(
      domains.map((d) => [d.id, capabilities.filter((c) => c.domain === d.id)]),
    );
  }, []);

  const selected = selectedId
    ? capabilities.find((c) => c.id === selectedId) ?? null
    : null;

  const outgoing = selected
    ? relationships.filter((r) => r.from === selected.id)
    : [];
  const incoming = selected
    ? relationships.filter((r) => r.to === selected.id)
    : [];
  const selectedEmerging = selected
    ? emergingByCapability[selected.id] ?? []
    : [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end gap-6 justify-between">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
            Architecture · {view}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            Capability landscape
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            The capabilities that run the enterprise, grouped by domain. Tiles
            with an amber count are affected by an emerging capability — open
            one to see what changes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ViewSwitcher value={view} onChange={setView} />
          <ModeSwitcher value={mode} onChange={setMode} />
        </div>
      </header>

      <Legend />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {domains.map((d) => (
            <DomainColumn
              key={d.id}
              domain={d}
              capabilities={capsByDomain[d.id] ?? []}
              selectedId={selectedId}
              emergingByCapability={emergingByCapability}
              onSelect={setSelectedId}
            />
          ))}
        </div>
        <div>
          {selected ? (
            <CapabilityDetail
              capability={selected}
              outgoing={outgoing}
              incoming={incoming}
              emerging={selectedEmerging}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <EmptyDetail />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
    <aside className="bg-white/60 rounded-2xl ring-1 ring-dashed ring-ink-200 p-6 text-center sticky top-24">
      <div className="text-sm font-medium text-ink-700">
        Select a capability
      </div>
      <p className="text-xs text-ink-500 mt-1 leading-relaxed">
        Click any tile to see its dependencies, ownership and the emerging
        signals reshaping it.
      </p>
    </aside>
  );
}

function Legend() {
  const items: { label: string; cls: string }[] = [
    { label: "Emerging", cls: "bg-signal-replace" },
    { label: "Developing", cls: "bg-signal-enhance" },
    { label: "Established", cls: "bg-signal-new" },
    { label: "Core", cls: "bg-ink-700" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink-500">
      <span className="uppercase tracking-[0.14em] font-medium text-ink-400">
        Maturity
      </span>
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${i.cls}`} />
          {i.label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5 ml-2">
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-signal-replace/15 text-signal-replace ring-1 ring-signal-replace/30">
          3
        </span>
        emerging signals affect this capability
      </span>
    </div>
  );
}
