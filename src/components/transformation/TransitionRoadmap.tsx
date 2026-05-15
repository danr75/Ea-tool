import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AdoptionHorizon } from "@/lib/types";
import type { RoadmapEntry } from "@/lib/transformation";
import { capabilitiesById } from "@/data/capabilities";
import { domainsById } from "@/data/domains";
import { impactColor, impactLabel } from "@/lib/format";

const horizonMeta: Record<
  AdoptionHorizon,
  { label: string; helper: string; accent: string; bg: string }
> = {
  now: {
    label: "Now",
    helper: "Move on this in the next 6 months",
    accent: "#22c55e",
    bg: "#dcfce7",
  },
  next: {
    label: "Next",
    helper: "Plan inside the next 12-18 months",
    accent: "#3b82f6",
    bg: "#dbeafe",
  },
  later: {
    label: "Later",
    helper: "Beyond the current planning horizon",
    accent: "#a855f7",
    bg: "#f3e8ff",
  },
  watch: {
    label: "Watch",
    helper: "Track signals, no action yet",
    accent: "#94a3b8",
    bg: "#eceef5",
  },
};

export function TransitionRoadmap({ roadmap }: { roadmap: RoadmapEntry[] }) {
  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold text-ink-900">
          Transition roadmap
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          When each emerging capability lands, and which existing capabilities
          it reshapes when it does.
        </p>
      </header>
      <div className="grid lg:grid-cols-3 gap-4">
        {roadmap
          .filter((r) => r.horizon !== "watch")
          .map((r) => {
            const meta = horizonMeta[r.horizon];
            return (
              <div
                key={r.horizon}
                className="rounded-2xl bg-white ring-1 ring-ink-100 shadow-card overflow-hidden flex flex-col"
              >
                <header
                  className="px-4 py-3 border-b border-ink-100 flex items-center gap-2"
                  style={{ background: meta.bg }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: meta.accent }}
                  />
                  <h3 className="text-sm font-semibold text-ink-900">
                    {meta.label}
                  </h3>
                  <span className="ml-auto text-[11px] text-ink-500">
                    {r.signals.length} signal{r.signals.length === 1 ? "" : "s"}
                  </span>
                </header>
                <p className="px-4 pt-3 text-[11px] text-ink-500">
                  {meta.helper}
                </p>
                <div className="p-3 space-y-3 flex-1">
                  {r.signals.map((s) => (
                    <Link
                      key={s.id}
                      href={`/emerging/${s.id}`}
                      className="block p-3 rounded-xl ring-1 ring-ink-100 hover:ring-ink-300/70 hover:shadow-card transition-all bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-ink-900 flex-1">
                          {s.name}
                        </h4>
                        <ArrowRight
                          size={12}
                          className="text-ink-300"
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-ink-500 line-clamp-2 leading-snug">
                        {s.summary}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.impacts.slice(0, 4).map((imp) => {
                          const cap = capabilitiesById[imp.capabilityId];
                          const dom = cap ? domainsById[cap.domain] : null;
                          if (!cap) return null;
                          return (
                            <span
                              key={imp.capabilityId}
                              className={[
                                "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ring-1",
                                impactColor[imp.kind],
                              ].join(" ")}
                              title={`${impactLabel[imp.kind]}: ${cap.name}`}
                            >
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{ background: dom?.accent }}
                              />
                              {cap.name}
                            </span>
                          );
                        })}
                        {s.impacts.length > 4 && (
                          <span className="text-[10px] text-ink-400 font-medium">
                            +{s.impacts.length - 4} more
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}
