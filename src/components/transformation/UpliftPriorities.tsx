import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CapabilityChange } from "@/lib/transformation";
import { domainsById } from "@/data/domains";
import { impactColor, impactLabel, maturityLabel } from "@/lib/format";
import { maturityColor } from "@/components/shell/OverlayToggle";

export function UpliftPriorities({
  changes,
}: {
  changes: CapabilityChange[];
}) {
  const top = changes.slice(0, 10);
  const maxScore = top[0]?.priorityScore ?? 1;

  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold text-ink-900">
          Capability uplift priorities
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          Ranked by emerging-signal impact × horizon urgency. Start here when
          sequencing investment.
        </p>
      </header>
      <ol className="space-y-2">
        {top.map((change, i) => {
          const cap = change.capability;
          const dom = domainsById[cap.domain];
          const pct = (change.priorityScore / maxScore) * 100;
          return (
            <li
              key={cap.id}
              className="bg-white rounded-xl ring-1 ring-ink-100 shadow-card overflow-hidden"
            >
              <Link
                href={`/architecture?view=conceptual&capability=${cap.id}`}
                className="block p-4 hover:bg-ink-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-ink-300 w-5 text-right tabular-nums">
                    {i + 1}
                  </span>
                  <span
                    className="w-1 self-stretch rounded-full"
                    style={{
                      background: maturityColor[cap.maturity],
                      minHeight: 32,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: dom.accent }}
                      />
                      {dom.shortName}
                      <span className="text-ink-200">·</span>
                      <span>{maturityLabel[cap.maturity]}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-ink-900 mt-0.5">
                      {cap.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {change.newSignals.length > 0 && (
                        <KindCount kind="new" n={change.newSignals.length} />
                      )}
                      {change.replaceSignals.length > 0 && (
                        <KindCount
                          kind="replace"
                          n={change.replaceSignals.length}
                        />
                      )}
                      {change.enhanceSignals.length > 0 && (
                        <KindCount
                          kind="enhance"
                          n={change.enhanceSignals.length}
                        />
                      )}
                      {change.consolidateSignals.length > 0 && (
                        <KindCount
                          kind="consolidate"
                          n={change.consolidateSignals.length}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 w-32 shrink-0">
                    <div className="text-[10px] uppercase tracking-wider text-ink-400 font-medium">
                      Priority
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div
                        className="h-full bg-ink-900"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-ink-500 tabular-nums">
                      {change.priorityScore.toFixed(2)}
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-ink-300" />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function KindCount({ kind, n }: { kind: "new" | "enhance" | "replace" | "consolidate"; n: number }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ring-1",
        impactColor[kind],
      ].join(" ")}
    >
      {impactLabel[kind]}
      <span className="opacity-70">×{n}</span>
    </span>
  );
}
