import { domains } from "@/data/domains";
import type { DomainAiImpact } from "@/lib/ai-evolution";

export function DomainHeatmap({ impact }: { impact: DomainAiImpact[] }) {
  const max = Math.max(...impact.map((i) => i.weightedScore), 0.0001);
  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold text-ink-900">
          Which layers AI is reshaping
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          Heat indicates the weighted AI-driven impact on each domain. Darker
          cells = more capabilities affected with greater urgency.
        </p>
      </header>
      <div className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {domains.map((d) => {
            const entry = impact.find((i) => i.domainId === d.id);
            if (!entry) return null;
            const intensity = entry.weightedScore / max;
            const bg = intensityColor(intensity, d.accent);
            return (
              <div
                key={d.id}
                className="relative rounded-xl p-4 ring-1 overflow-hidden"
                style={{
                  background: bg,
                  borderColor: d.accent + "40",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: d.accent }}
                  />
                  <h3 className="text-xs font-semibold text-ink-900">
                    {d.shortName}
                  </h3>
                </div>
                <div className="mt-3 text-2xl font-semibold text-ink-900 tabular-nums leading-none">
                  {entry.capabilitiesImpacted}
                  <span className="text-sm text-ink-400 font-medium">
                    /{entry.totalCapabilities}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-ink-500">
                  capabilities touched
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-wider text-ink-400 font-semibold">
                  {entry.signalsTouching} signal
                  {entry.signalsTouching === 1 ? "" : "s"}
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-white/60 overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.round(intensity * 100)}%`,
                      background: d.accent,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function intensityColor(intensity: number, accent: string) {
  // Mix accent with white based on intensity.
  const alpha = Math.max(0.06, Math.min(0.32, 0.06 + intensity * 0.32));
  return `${accent}${alphaToHex(alpha)}`;
}

function alphaToHex(a: number) {
  const v = Math.round(a * 255);
  return v.toString(16).padStart(2, "0");
}
