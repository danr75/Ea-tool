"use client";

import type { Capability, Domain, EmergingCapability } from "@/lib/types";
import { CapabilityTile } from "./CapabilityTile";
import { NewCapabilityForm } from "./NewCapabilityForm";
import type { Overlay } from "@/components/shell/OverlayToggle";

export function DomainColumn({
  domain,
  capabilities,
  selectedId,
  emergingByCapability,
  overlay,
  onSelect,
  onCapabilityCreated,
}: {
  domain: Domain;
  capabilities: Capability[];
  selectedId: string | null;
  emergingByCapability: Record<string, EmergingCapability[]>;
  overlay: Overlay;
  onSelect: (id: string) => void;
  onCapabilityCreated?: (c: Capability) => void;
}) {
  const impactedCount = capabilities.filter(
    (c) => (emergingByCapability[c.id]?.length ?? 0) > 0,
  ).length;
  return (
    <section
      className="rounded-2xl bg-white/60 ring-1 ring-ink-100 shadow-card overflow-hidden flex flex-col"
      style={{
        backgroundImage: `linear-gradient(180deg, ${domain.accent}10 0%, transparent 60%)`,
      }}
    >
      <header className="px-4 pt-4 pb-3 border-b border-ink-100/80 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: domain.accent }}
          />
          <h3 className="text-sm font-semibold text-ink-900">{domain.name}</h3>
          <span className="ml-auto text-[11px] text-ink-400 font-medium">
            {capabilities.length}
            {overlay === "emerging" && impactedCount > 0 && (
              <span className="ml-1.5 text-signal-replace">
                · {impactedCount} impacted
              </span>
            )}
          </span>
        </div>
        <p className="text-[11px] text-ink-500 leading-snug mt-1.5">
          {domain.description}
        </p>
      </header>
      <div className="p-3 space-y-2 flex-1">
        {capabilities.map((c) => (
          <CapabilityTile
            key={c.id}
            capability={c}
            selected={selectedId === c.id}
            emergingImpacts={emergingByCapability[c.id] ?? []}
            overlay={overlay}
            onClick={() => onSelect(c.id)}
          />
        ))}
        {onCapabilityCreated && (
          <NewCapabilityForm
            domain={domain.id}
            onCreated={onCapabilityCreated}
          />
        )}
      </div>
    </section>
  );
}
