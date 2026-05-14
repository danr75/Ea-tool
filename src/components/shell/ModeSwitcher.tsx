"use client";

import type { AppMode } from "@/lib/types";

const modes: { id: AppMode; label: string; description: string }[] = [
  {
    id: "executive",
    label: "Executive",
    description: "Strategic capabilities, trends and investment lens.",
  },
  {
    id: "architect",
    label: "Architect",
    description: "Dependencies, ownership and shared services.",
  },
  {
    id: "transformation",
    label: "Transformation",
    description: "Current to future state with sequencing.",
  },
  {
    id: "ai-evolution",
    label: "AI Evolution",
    description: "How AI is reshaping each layer.",
  },
];

export function ModeSwitcher({
  value,
  onChange,
}: {
  value: AppMode;
  onChange: (v: AppMode) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-ink-100 border border-ink-200/60">
      {modes.map((m) => {
        const active = value === m.id;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            className={[
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              active
                ? "bg-white text-ink-900 shadow-card"
                : "text-ink-500 hover:text-ink-900",
            ].join(" ")}
            title={m.description}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
