"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import type { AppMode, MaturityLevel, ViewLevel } from "@/lib/types";
import { capabilities } from "@/data/capabilities";
import { domains } from "@/data/domains";
import { emergingCapabilities } from "@/data/emerging";
import { relationships } from "@/data/relationships";
import { maturityLabel } from "@/lib/format";
import { ModeSwitcher } from "@/components/shell/ModeSwitcher";
import { ViewSwitcher } from "@/components/shell/ViewSwitcher";
import {
  OverlayToggle,
  maturityColor,
  type Overlay,
} from "@/components/shell/OverlayToggle";
import { DomainColumn } from "@/components/conceptual/DomainColumn";
import { CapabilityDetail } from "@/components/conceptual/CapabilityDetail";

export default function ArchitecturePage() {
  const [mode, setMode] = useState<AppMode>("executive");
  const [view, setView] = useState<ViewLevel>("conceptual");
  const [overlay, setOverlay] = useState<Overlay>("emerging");
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

  const impactedTotal = Object.keys(emergingByCapability).length;

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
            The capabilities that run the enterprise, grouped by domain. Switch
            the overlay to see which capabilities are most mature, or which are
            being reshaped by emerging signals.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <ViewSwitcher value={view} onChange={setView} />
          <ModeSwitcher value={mode} onChange={setMode} />
          <OverlayToggle value={overlay} onChange={setOverlay} />
        </div>
      </header>

      <Legend overlay={overlay} impactedTotal={impactedTotal} />

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {domains.map((d) => (
            <DomainColumn
              key={d.id}
              domain={d}
              capabilities={capsByDomain[d.id] ?? []}
              selectedId={selectedId}
              emergingByCapability={emergingByCapability}
              overlay={overlay}
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

function Legend({
  overlay,
  impactedTotal,
}: {
  overlay: Overlay;
  impactedTotal: number;
}) {
  if (overlay === "maturity") {
    const levels: MaturityLevel[] = [
      "emerging",
      "developing",
      "established",
      "core",
    ];
    return (
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink-600 bg-white rounded-xl ring-1 ring-ink-100 shadow-card px-4 py-2.5">
        <span className="uppercase tracking-[0.14em] font-semibold text-ink-400">
          Maturity overlay
        </span>
        {levels.map((l) => (
          <span key={l} className="inline-flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm"
              style={{ background: maturityColor[l] }}
            />
            <span className="font-medium">{maturityLabel[l]}</span>
          </span>
        ))}
        <span className="ml-auto text-ink-400">
          Tile rail + tint reflect maturity level.
        </span>
      </div>
    );
  }

  if (overlay === "emerging") {
    return (
      <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink-600 bg-white rounded-xl ring-1 ring-ink-100 shadow-card px-4 py-2.5">
        <span className="uppercase tracking-[0.14em] font-semibold text-ink-400">
          Emerging impact overlay
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold leading-none px-1.5 py-1 rounded-full bg-signal-replace text-white">
            <Sparkles size={10} strokeWidth={2.5} />
            N
          </span>
          <span className="font-medium">
            Capabilities being reshaped — count = emerging signals affecting it
          </span>
        </span>
        <span className="ml-auto text-ink-400">
          {impactedTotal} of {capabilities.length} capabilities impacted
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-500">
      <span className="uppercase tracking-[0.14em] font-medium text-ink-400">
        Default view
      </span>
      <span>
        Coloured rail on each tile = maturity. Pick an overlay to bring it
        forward.
      </span>
    </div>
  );
}
