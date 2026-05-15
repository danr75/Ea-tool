"use client";

import type { MaturityLevel } from "@/lib/types";

export type Overlay = "none" | "maturity" | "emerging";

const options: { id: Overlay; label: string; hint: string }[] = [
  { id: "none", label: "None", hint: "Default tile rendering" },
  { id: "maturity", label: "Maturity", hint: "Colour tiles by maturity level" },
  {
    id: "emerging",
    label: "Emerging impact",
    hint: "Highlight capabilities affected by emerging signals",
  },
];

export const maturityColor: Record<MaturityLevel, string> = {
  emerging: "#f59e0b",
  developing: "#3b82f6",
  established: "#22c55e",
  core: "#373d51",
};

export function OverlayToggle({
  value,
  onChange,
}: {
  value: Overlay;
  onChange: (v: Overlay) => void;
}) {
  return (
    <div className="inline-flex flex-col gap-1.5">
      <span className="text-[10px] uppercase tracking-[0.14em] text-ink-400 font-medium">
        Overlay
      </span>
      <div className="inline-flex p-1 rounded-xl bg-white ring-1 ring-ink-200/60 shadow-card">
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-ink-900 text-white shadow-card"
                  : "text-ink-600 hover:text-ink-900",
              ].join(" ")}
              title={opt.hint}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
