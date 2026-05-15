import {
  computeCapabilityChanges,
  computeFutureStateSummary,
  computeRoadmap,
} from "@/lib/transformation";
import { TransitionRoadmap } from "./TransitionRoadmap";
import { CapabilityDelta } from "./CapabilityDelta";
import { UpliftPriorities } from "./UpliftPriorities";

export function TransformationView() {
  const changes = computeCapabilityChanges();
  const roadmap = computeRoadmap();
  const summary = computeFutureStateSummary();

  const stats = [
    {
      label: "New capabilities",
      value: summary.newCount,
      hint: "introduced by emerging signals",
      accent: "#22c55e",
    },
    {
      label: "Enhanced",
      value: summary.enhanceCount,
      hint: "existing capabilities lifted",
      accent: "#3b82f6",
    },
    {
      label: "Replaced",
      value: summary.replaceCount,
      hint: "current functionality superseded",
      accent: "#f59e0b",
    },
    {
      label: "Consolidated",
      value: summary.consolidateCount,
      hint: "tooling rationalised",
      accent: "#a855f7",
    },
    {
      label: "Capabilities changing",
      value: `${summary.impactedCapabilities}/${summary.totalCapabilities}`,
      hint: "across the enterprise landscape",
      accent: "#171b27",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <header className="space-y-2 max-w-3xl mb-4">
          <h2 className="text-base font-semibold text-ink-900">
            From current state to future state
          </h2>
          <p className="text-sm text-ink-500 leading-relaxed">
            What the emerging-signal portfolio implies for the enterprise
            architecture, summarised as a portfolio of changes the platform
            will need to absorb.
          </p>
        </header>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl ring-1 ring-ink-100 shadow-card p-4 relative overflow-hidden"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1"
                style={{ background: s.accent }}
              />
              <div className="pl-2">
                <div className="text-2xl font-semibold text-ink-900 tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs font-medium text-ink-600 mt-1">
                  {s.label}
                </div>
                <div className="text-[11px] text-ink-400 mt-0.5 leading-snug">
                  {s.hint}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <TransitionRoadmap roadmap={roadmap} />
      <UpliftPriorities changes={changes} />
      <CapabilityDelta changes={changes} />
    </div>
  );
}
