"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import type { Capability, MaturityLevel } from "@/lib/types";
import { maturityLabel } from "@/lib/format";
import { maturityColor } from "@/components/shell/OverlayToggle";
import { saveCapabilityMaturity } from "@/app/actions/capabilities";

const LEVELS: MaturityLevel[] = ["emerging", "developing", "established", "core"];

export function EditableMaturity({
  capability,
  onCapabilityUpdated,
}: {
  capability: Capability;
  onCapabilityUpdated?: (c: Capability) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const pick = (level: MaturityLevel) => {
    if (level === capability.maturity) {
      setOpen(false);
      return;
    }
    startTransition(async () => {
      const result = await saveCapabilityMaturity(capability.id, level);
      if (result.ok) {
        onCapabilityUpdated?.(result.capability);
      }
      setOpen(false);
    });
  };

  const color = maturityColor[capability.maturity];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => onCapabilityUpdated && setOpen((o) => !o)}
        disabled={!onCapabilityUpdated || pending}
        className={[
          "inline-flex items-center gap-1.5 text-[11px] font-medium px-1.5 py-0.5 rounded-md transition-colors",
          onCapabilityUpdated
            ? "hover:bg-ink-100 cursor-pointer"
            : "cursor-default",
        ].join(" ")}
        title={onCapabilityUpdated ? "Change maturity" : undefined}
      >
        {pending ? (
          <Loader2 size={9} className="animate-spin text-ink-400" />
        ) : (
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: color }}
          />
        )}
        <span className="text-ink-900">{maturityLabel[capability.maturity]}</span>
        {onCapabilityUpdated && (
          <ChevronDown size={10} className="text-ink-400" />
        )}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-white rounded-lg ring-1 ring-ink-200 shadow-pop min-w-[150px] overflow-hidden">
          {LEVELS.map((level) => {
            const active = level === capability.maturity;
            return (
              <button
                key={level}
                type="button"
                onClick={() => pick(level)}
                className={[
                  "w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors",
                  active ? "bg-ink-50" : "hover:bg-ink-50",
                ].join(" ")}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: maturityColor[level] }}
                />
                <span className="text-ink-900 font-medium flex-1">
                  {maturityLabel[level]}
                </span>
                {active && <Check size={11} className="text-ink-900" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
