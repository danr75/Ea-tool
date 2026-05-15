"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import type { AppMode, MaturityLevel, ViewLevel } from "@/lib/types";
import { capabilities, capabilitiesById } from "@/data/capabilities";
import { domains } from "@/data/domains";
import { emergingCapabilities } from "@/data/emerging";
import { relationships } from "@/data/relationships";
import { capabilitiesWithLogical } from "@/data/logical";
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
import { LogicalView } from "@/components/logical/LogicalView";

const VALID_VIEWS: ViewLevel[] = ["conceptual", "logical", "physical"];

export default function ArchitecturePage() {
  return (
    <Suspense fallback={<div className="text-sm text-ink-400">Loading…</div>}>
      <ArchitecturePageInner />
    </Suspense>
  );
}

function ArchitecturePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get("view") as ViewLevel | null;
  const view: ViewLevel = VALID_VIEWS.includes(viewParam ?? "conceptual" as ViewLevel)
    ? (viewParam ?? "conceptual")
    : "conceptual";
  const selectedId = searchParams.get("capability");

  const [mode, setMode] = useState<AppMode>("executive");
  const [overlay, setOverlay] = useState<Overlay>("emerging");

  const setQuery = useCallback(
    (updates: { view?: ViewLevel; capability?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.view !== undefined) params.set("view", updates.view);
      if (updates.capability !== undefined) {
        if (updates.capability === null) params.delete("capability");
        else params.set("capability", updates.capability);
      }
      const qs = params.toString();
      router.replace(qs ? `/architecture?${qs}` : "/architecture", {
        scroll: false,
      });
    },
    [router, searchParams],
  );

  const setView = useCallback(
    (v: ViewLevel) => setQuery({ view: v }),
    [setQuery],
  );
  const setSelectedId = useCallback(
    (id: string | null) => setQuery({ capability: id }),
    [setQuery],
  );

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

  const impactedTotal = Object.keys(emergingByCapability).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end gap-6 justify-between">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
            Architecture · {view}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            {view === "conceptual"
              ? "Capability landscape"
              : view === "logical"
                ? "Logical architecture"
                : "Physical architecture"}
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            {view === "conceptual"
              ? "The capabilities that run the enterprise, grouped by domain. Pick a capability and drill into its logical view to see how it's actually implemented."
              : "Services, platforms, data stores and policy points that implement each capability — plus the cross-capability dependencies between them."}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <ViewSwitcher value={view} onChange={setView} />
          <ModeSwitcher value={mode} onChange={setMode} />
          {view === "conceptual" && (
            <OverlayToggle value={overlay} onChange={setOverlay} />
          )}
        </div>
      </header>

      {view === "conceptual" && (
        <ConceptualView
          overlay={overlay}
          selectedId={selectedId}
          impactedTotal={impactedTotal}
          capsByDomain={capsByDomain}
          emergingByCapability={emergingByCapability}
          onSelect={setSelectedId}
          onDrillIntoLogical={(id) =>
            setQuery({ view: "logical", capability: id })
          }
        />
      )}

      {view === "logical" && (
        <LogicalView
          capabilityId={selectedId}
          onPickCapability={(id) => setSelectedId(id)}
          onBackToConceptual={() =>
            setQuery({ view: "conceptual" })
          }
        />
      )}

      {view === "physical" && <PhysicalPlaceholder />}
    </div>
  );
}

function ConceptualView({
  overlay,
  selectedId,
  impactedTotal,
  capsByDomain,
  emergingByCapability,
  onSelect,
  onDrillIntoLogical,
}: {
  overlay: Overlay;
  selectedId: string | null;
  impactedTotal: number;
  capsByDomain: Record<string, typeof capabilities>;
  emergingByCapability: Record<string, typeof emergingCapabilities>;
  onSelect: (id: string | null) => void;
  onDrillIntoLogical: (id: string) => void;
}) {
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
  const hasLogical = selected
    ? capabilitiesWithLogical.includes(selected.id)
    : false;

  return (
    <>
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
              onSelect={onSelect}
            />
          ))}
        </div>
        <div className="space-y-3">
          {selected ? (
            <>
              <CapabilityDetail
                capability={selected}
                outgoing={outgoing}
                incoming={incoming}
                emerging={selectedEmerging}
                onClose={() => onSelect(null)}
              />
              <button
                type="button"
                onClick={() => onDrillIntoLogical(selected.id)}
                disabled={!hasLogical}
                className={[
                  "w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  hasLogical
                    ? "bg-ink-900 text-white hover:bg-ink-800 shadow-card"
                    : "bg-ink-100 text-ink-400 cursor-not-allowed",
                ].join(" ")}
                title={
                  hasLogical
                    ? "Open this capability at the logical layer"
                    : "Logical view not authored for this capability in the slice"
                }
              >
                {hasLogical
                  ? "Open in logical view"
                  : "Logical view not yet authored"}
                {hasLogical && <ArrowRight size={14} />}
              </button>
            </>
          ) : (
            <EmptyDetail />
          )}
        </div>
      </div>
    </>
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

function PhysicalPlaceholder() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-dashed ring-ink-200 p-10 max-w-3xl text-center mx-auto">
      <span className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
        Physical view
      </span>
      <h2 className="mt-2 text-lg font-semibold text-ink-900">Coming in the next slice</h2>
      <p className="mt-2 text-sm text-ink-500 max-w-md mx-auto leading-relaxed">
        The physical layer will show where workloads actually run — cloud
        environments, SaaS platforms, networks and devices.
      </p>
    </div>
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
