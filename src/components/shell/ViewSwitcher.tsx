"use client";

import type { ViewLevel } from "@/lib/types";

const views: {
  id: ViewLevel;
  label: string;
  hint: string;
  available: boolean;
}[] = [
  {
    id: "conceptual",
    label: "Conceptual",
    hint: "Capabilities and outcomes",
    available: true,
  },
  {
    id: "logical",
    label: "Logical",
    hint: "Services, flows and interactions",
    available: true,
  },
  {
    id: "physical",
    label: "Physical",
    hint: "Platforms, infrastructure, tooling",
    available: true,
  },
];

export function ViewSwitcher({
  value,
  onChange,
}: {
  value: ViewLevel;
  onChange: (v: ViewLevel) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Architecture view"
      className="inline-flex p-1 rounded-xl bg-white ring-1 ring-ink-200/60 shadow-card"
    >
      {views.map((v) => {
        const active = value === v.id;
        return (
          <button
            key={v.id}
            type="button"
            disabled={!v.available}
            onClick={() => v.available && onChange(v.id)}
            aria-pressed={active}
            className={[
              "relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2",
              active
                ? "bg-ink-900 text-white shadow-card"
                : v.available
                  ? "text-ink-600 hover:text-ink-900"
                  : "text-ink-300 cursor-not-allowed",
            ].join(" ")}
            title={v.hint}
          >
            {v.label}
            {!v.available && (
              <span className="ml-1.5 text-[10px] uppercase tracking-wider opacity-70">
                soon
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
