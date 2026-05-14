"use client";

import type { Capability, EmergingCapability } from "@/lib/types";
import { MaturityDot } from "./MaturityDot";

export function CapabilityTile({
  capability,
  selected,
  emergingImpacts,
  onClick,
}: {
  capability: Capability;
  selected: boolean;
  emergingImpacts: EmergingCapability[];
  onClick: () => void;
}) {
  const impacted = emergingImpacts.length > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group text-left w-full p-3 rounded-lg border transition-all",
        selected
          ? "bg-ink-900 text-white border-ink-900 shadow-pop"
          : "bg-white border-ink-100 hover:border-ink-300/70 hover:shadow-card",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <MaturityDot level={capability.maturity} />
        <span
          className={[
            "text-sm font-medium leading-snug flex-1",
            selected ? "text-white" : "text-ink-900",
          ].join(" ")}
        >
          {capability.name}
        </span>
        {impacted && (
          <span
            title={`${emergingImpacts.length} emerging signal${
              emergingImpacts.length === 1 ? "" : "s"
            } affect this capability`}
            className={[
              "shrink-0 text-[10px] font-semibold leading-none px-1.5 py-0.5 rounded-full ring-1",
              selected
                ? "bg-white/15 text-white ring-white/30"
                : "bg-signal-replace/15 text-signal-replace ring-signal-replace/30",
            ].join(" ")}
          >
            {emergingImpacts.length}
          </span>
        )}
      </div>
    </button>
  );
}
