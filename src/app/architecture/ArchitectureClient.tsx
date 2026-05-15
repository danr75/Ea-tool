"use client";

import { Suspense, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import type {
  AppMode,
  Capability,
  MaturityLevel,
  ViewLevel,
} from "@/lib/types";
import { domains } from "@/data/domains";
import { emergingCapabilities } from "@/data/emerging";
import { relationships } from "@/data/relationships";
import { capabilitiesWithLogical } from "@/data/logical";
import { capabilitiesWithPhysical } from "@/data/physical";
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
import { PhysicalView } from "@/components/physical/PhysicalView";
import { TransformationView } from "@/components/transformation/TransformationView";
import { AiEvolutionView } from "@/components/ai-evolution/AiEvolutionView";

const VALID_VIEWS: ViewLevel[] = ["conceptual", "logical", "physical"];
const VALID_MODES: AppMode[] = [
  "executive",
  "architect",
  "transformation",
  "ai-evolution",
];

export function ArchitectureClient({
  initialCapabilities,
}: {
  initialCapabilities: Capability[];
}) {
  return (
    <Suspense fallback={<div className="text-sm text-ink-400">Loading…</div>}>
      <ArchitectureClientInner initialCapabilities={initialCapabilities} />
    </Suspense>
  );
}

function ArchitectureClientInner({
  initialCapabilities,
}: {
  initialCapabilities: Capability[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [capabilities, setCapabilities] = useState<Capability[]>(initialCapabilities);

  const handleCapabilityUpdated = useCallback((updated: Capability) => {
    setCapabilities((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  }, []);

  const viewParam = searchParams.get("view") as ViewLevel | null;
  const view: ViewLevel = VALID_VIEWS.includes(viewParam ?? "conceptual" as ViewLevel)
    ? (viewParam ?? "conceptual")
    : "conceptual";
  const modeParam = searchParams.get("mode") as AppMode | null;
  const mode: AppMode = VALID_MODES.includes(modeParam ?? "executive" as AppMode)
    ? (modeParam ?? "executive")
    : "executive";
  const overlayParam = searchParams.get("overlay") as Overlay | null;
  const overlay: Overlay =
    overlayParam === "none" || overlayParam === "maturity" || overlayParam === "emerging"
      ? overlayParam
      : "emerging";
  const selectedId = searchParams.get("capability");

  const setQuery = useCallback(
    (updates: {
      view?: ViewLevel;
      capability?: string | null;
      mode?: AppMode;
      overlay?: Overlay;
    }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.view !== undefined) params.set("view", updates.view);
      if (updates.mode !== undefined) params.set("mode", updates.mode);
      if (updates.overlay !== undefined) params.set("overlay", updates.overlay);
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
  const setMode = useCallback(
    (m: AppMode) => setQuery({ mode: m }),
    [setQuery],
  );
  const setOverlay = useCallback(
    (o: Overlay) => setQuery({ overlay: o }),
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
  }, [capabilities]);

  const impactedTotal = Object.keys(emergingByCapability).length;

  const isTransformation = mode === "transformation";
  const isAiEvolution = mode === "ai-evolution";
  const isOverlayMode = isTransformation || isAiEvolution;

  const headerCopy = isTransformation
    ? {
        eyebrow: "Architecture · transformation",
        title: "Transformation planning",
        body: "Current state to future state, sequenced by adoption horizon and prioritised by capability impact. Independent of the view — the transformation lens is applied across the whole architecture.",
      }
    : isAiEvolution
      ? {
          eyebrow: "Architecture · AI evolution",
          title: "How AI is reshaping the enterprise",
          body: "The AI-specific cut of the transformation portfolio: which layers AI most reshapes, which new capabilities become mandatory, which existing capabilities become unrecognisable, and how the operating model has to change.",
        }
      : {
          eyebrow: `Architecture · ${view}`,
          title:
            view === "conceptual"
              ? "Capability landscape"
              : view === "logical"
                ? "Logical architecture"
                : "Physical architecture",
          body:
            view === "conceptual"
              ? "The capabilities that run the enterprise, grouped by domain. Pick a capability and drill into its logical view to see how it's actually implemented."
              : "Services, platforms, data stores and policy points that implement each capability — plus the cross-capability dependencies between them.",
        };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end gap-6 justify-between">
        <div className="space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
            {headerCopy.eyebrow}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
            {headerCopy.title}
          </h1>
          <p className="text-sm text-ink-500 leading-relaxed">
            {headerCopy.body}
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          {!isOverlayMode && (
            <ViewSwitcher value={view} onChange={setView} />
          )}
          <ModeSwitcher value={mode} onChange={setMode} />
          {!isOverlayMode && view === "conceptual" && (
            <OverlayToggle value={overlay} onChange={setOverlay} />
          )}
        </div>
      </header>

      {isTransformation ? (
        <TransformationView />
      ) : isAiEvolution ? (
        <AiEvolutionView />
      ) : (
        <>
          {view === "conceptual" && (
            <ConceptualView
              capabilities={capabilities}
              overlay={overlay}
              selectedId={selectedId}
              impactedTotal={impactedTotal}
              capsByDomain={capsByDomain}
              emergingByCapability={emergingByCapability}
              onSelect={setSelectedId}
              onDrillIntoLogical={(id) =>
                setQuery({ view: "logical", capability: id })
              }
              onDrillIntoPhysical={(id) =>
                setQuery({ view: "physical", capability: id })
              }
              onCapabilityUpdated={handleCapabilityUpdated}
            />
          )}

          {view === "logical" && (
            <LogicalView
              capabilityId={selectedId}
              onPickCapability={(id) => setSelectedId(id)}
              onBackToConceptual={() => setQuery({ view: "conceptual" })}
            />
          )}

          {view === "physical" && (
            <PhysicalView
              capabilityId={selectedId}
              onPickCapability={(id) => setSelectedId(id)}
              onBackToConceptual={() => setQuery({ view: "conceptual" })}
            />
          )}
        </>
      )}
    </div>
  );
}

function ConceptualView({
  capabilities,
  overlay,
  selectedId,
  impactedTotal,
  capsByDomain,
  emergingByCapability,
  onSelect,
  onDrillIntoLogical,
  onDrillIntoPhysical,
  onCapabilityUpdated,
}: {
  capabilities: Capability[];
  overlay: Overlay;
  selectedId: string | null;
  impactedTotal: number;
  capsByDomain: Record<string, Capability[]>;
  emergingByCapability: Record<string, typeof emergingCapabilities>;
  onSelect: (id: string | null) => void;
  onDrillIntoLogical: (id: string) => void;
  onDrillIntoPhysical: (id: string) => void;
  onCapabilityUpdated: (c: Capability) => void;
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
  const hasPhysical = selected
    ? capabilitiesWithPhysical.includes(selected.id)
    : false;

  return (
    <>
      <Legend
        overlay={overlay}
        impactedTotal={impactedTotal}
        totalCapabilities={capabilities.length}
      />

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
                onCapabilityUpdated={onCapabilityUpdated}
              />
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onDrillIntoLogical(selected.id)}
                  disabled={!hasLogical}
                  className={[
                    "inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    hasLogical
                      ? "bg-ink-900 text-white hover:bg-ink-800 shadow-card"
                      : "bg-ink-100 text-ink-400 cursor-not-allowed",
                  ].join(" ")}
                  title={
                    hasLogical
                      ? "Open at the logical layer"
                      : "Logical view not authored for this capability"
                  }
                >
                  Logical
                  {hasLogical && <ArrowRight size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => onDrillIntoPhysical(selected.id)}
                  disabled={!hasPhysical}
                  className={[
                    "inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    hasPhysical
                      ? "bg-ink-900 text-white hover:bg-ink-800 shadow-card"
                      : "bg-ink-100 text-ink-400 cursor-not-allowed",
                  ].join(" ")}
                  title={
                    hasPhysical
                      ? "Open at the physical layer"
                      : "Physical view not authored for this capability"
                  }
                >
                  Physical
                  {hasPhysical && <ArrowRight size={14} />}
                </button>
              </div>
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

function Legend({
  overlay,
  impactedTotal,
  totalCapabilities,
}: {
  overlay: Overlay;
  impactedTotal: number;
  totalCapabilities: number;
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
          {impactedTotal} of {totalCapabilities} capabilities impacted
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
