"use client";

import { Sparkles } from "lucide-react";
import type { Capability, EmergingCapability } from "@/lib/types";
import { maturityLabel } from "@/lib/format";
import {
  maturityColor,
  type Overlay,
} from "@/components/shell/OverlayToggle";

export function CapabilityTile({
  capability,
  selected,
  emergingImpacts,
  overlay,
  onClick,
}: {
  capability: Capability;
  selected: boolean;
  emergingImpacts: EmergingCapability[];
  overlay: Overlay;
  onClick: () => void;
}) {
  const impactedCount = emergingImpacts.length;
  const impacted = impactedCount > 0;
  const matColor = maturityColor[capability.maturity];

  // Emerging overlay: dim untouched tiles, hero-treat impacted ones.
  const emergingMuted = overlay === "emerging" && !impacted && !selected;
  const emergingHero = overlay === "emerging" && impacted;

  // Maturity overlay: tint the whole tile by maturity colour.
  const maturityHero = overlay === "maturity";

  const base =
    "group relative text-left w-full rounded-lg border transition-all overflow-hidden";

  let classes: string;
  let style: React.CSSProperties | undefined;

  if (selected) {
    classes = `${base} bg-ink-900 text-white border-ink-900 shadow-pop`;
  } else if (emergingHero) {
    classes = `${base} bg-signal-replace/10 border-signal-replace/40 ring-1 ring-signal-replace/20 shadow-card hover:shadow-pop`;
  } else if (maturityHero) {
    classes = `${base} bg-white border-ink-100 hover:shadow-card`;
    style = {
      backgroundImage: `linear-gradient(90deg, ${matColor}22 0%, ${matColor}05 60%, transparent 100%)`,
      borderColor: `${matColor}55`,
    };
  } else if (emergingMuted) {
    classes = `${base} bg-white/60 border-ink-100/60 opacity-50 hover:opacity-100`;
  } else {
    classes = `${base} bg-white border-ink-100 hover:border-ink-300/70 hover:shadow-card`;
  }

  return (
    <button type="button" onClick={onClick} className={classes} style={style}>
      {/* Maturity rail on the left edge */}
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ background: matColor }}
      />
      <div className="pl-4 pr-3 py-3">
        <div className="flex items-start gap-2">
          <span
            className={[
              "text-sm font-medium leading-snug flex-1",
              selected ? "text-white" : "text-ink-900",
            ].join(" ")}
          >
            {capability.name}
          </span>
          {impacted && (
            <EmergingBadge
              count={impactedCount}
              selected={selected}
              prominent={overlay === "emerging"}
            />
          )}
        </div>
        {overlay === "maturity" && (
          <div
            className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: selected ? "white" : matColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: matColor }}
            />
            {maturityLabel[capability.maturity]}
          </div>
        )}
      </div>
    </button>
  );
}

function EmergingBadge({
  count,
  selected,
  prominent,
}: {
  count: number;
  selected: boolean;
  prominent: boolean;
}) {
  if (prominent && !selected) {
    return (
      <span
        title={`${count} emerging signal${count === 1 ? "" : "s"} affect this capability`}
        className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold leading-none px-1.5 py-1 rounded-full bg-signal-replace text-white shadow-card"
      >
        <Sparkles size={10} strokeWidth={2.5} />
        {count}
      </span>
    );
  }
  return (
    <span
      title={`${count} emerging signal${count === 1 ? "" : "s"} affect this capability`}
      className={[
        "shrink-0 inline-flex items-center gap-0.5 text-[10px] font-semibold leading-none px-1.5 py-0.5 rounded-full ring-1",
        selected
          ? "bg-white/15 text-white ring-white/30"
          : "bg-signal-replace/15 text-signal-replace ring-signal-replace/30",
      ].join(" ")}
    >
      <Sparkles size={9} strokeWidth={2.5} />
      {count}
    </span>
  );
}
