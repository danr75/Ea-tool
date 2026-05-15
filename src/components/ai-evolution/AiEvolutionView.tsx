import {
  aiSignals,
  computeAiHeadline,
  computeDomainImpact,
  computeMandatoryCapabilities,
  computeOperatingModelShifts,
  computeReshapedCapabilities,
} from "@/lib/ai-evolution";
import { DomainHeatmap } from "./DomainHeatmap";
import { MandatoryCapabilities } from "./MandatoryCapabilities";
import { OperatingModelShiftsPanel } from "./OperatingModelShifts";
import { ReshapedCapabilities } from "./ReshapedCapabilities";

export function AiEvolutionView() {
  const headline = computeAiHeadline();
  const domainImpact = computeDomainImpact();
  const mandatory = computeMandatoryCapabilities();
  const reshaped = computeReshapedCapabilities();
  const shifts = computeOperatingModelShifts();
  const aiSignalList = aiSignals();

  const aiSignalShare = Math.round(
    (headline.aiSignalCount / Math.max(headline.totalSignalCount, 1)) * 100,
  );

  const stats = [
    {
      label: "Of all change is AI-driven",
      value: `${aiSignalShare}%`,
      hint: `${headline.aiSignalCount} of ${headline.totalSignalCount} emerging signals`,
      accent: "#8b5cf6",
    },
    {
      label: "Now-horizon AI signals",
      value: headline.nowHorizon,
      hint: "Move on these in the next 6 months",
      accent: "#22c55e",
    },
    {
      label: "Capabilities becoming mandatory",
      value: headline.mandatoryCount,
      hint: "New AI-driven functions you must operate",
      accent: "#3b82f6",
    },
    {
      label: "Existing capabilities reshaped",
      value: headline.reshapedCount,
      hint: "Enhanced, replaced or consolidated by AI",
      accent: "#f59e0b",
    },
    {
      label: "Domains touched",
      value: `${headline.domainsTouched}/${headline.totalDomains}`,
      hint: "AI is reshaping every layer",
      accent: "#171b27",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <header className="space-y-2 max-w-3xl mb-4">
          <h2 className="text-base font-semibold text-ink-900">
            How AI is reshaping the enterprise architecture
          </h2>
          <p className="text-sm text-ink-500 leading-relaxed">
            Filtered to the {headline.aiSignalCount} AI-driven signals across
            the radar. Tells the AI-specific story behind the wider
            transformation portfolio: what becomes mandatory, what becomes
            unrecognisable, and how the operating model has to change.
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

      <DomainHeatmap impact={domainImpact} />
      <MandatoryCapabilities items={mandatory} />
      <ReshapedCapabilities items={reshaped} />
      <OperatingModelShiftsPanel shifts={shifts} />

      <section className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5">
        <h3 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold mb-3">
          Signals informing this view
        </h3>
        <div className="flex flex-wrap gap-2">
          {aiSignalList.map((s) => (
            <a
              key={s.id}
              href={`/emerging/${s.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-ink-100 text-ink-700 hover:bg-ink-900 hover:text-white transition-colors"
            >
              {s.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
