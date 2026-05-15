import type { ImpactKind } from "@/lib/types";
import type { CapabilityChange } from "@/lib/transformation";
import { capabilities } from "@/data/capabilities";
import { domains } from "@/data/domains";
import { impactColor, impactLabel } from "@/lib/format";

export function CapabilityDelta({
  changes,
}: {
  changes: CapabilityChange[];
}) {
  const changesById = Object.fromEntries(
    changes.map((c) => [c.capability.id, c]),
  );

  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold text-ink-900">
          Future-state delta by domain
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          Per-capability change kind: <Chip kind="new" /> new, <Chip kind="enhance" /> enhanced, <Chip kind="replace" /> replaced, <Chip kind="consolidate" /> consolidated, or unchanged.
        </p>
      </header>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {domains.map((d) => {
          const domainCaps = capabilities.filter((c) => c.domain === d.id);
          const impacted = domainCaps.filter((c) => changesById[c.id]).length;
          return (
            <div
              key={d.id}
              className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(180deg, ${d.accent}10 0%, transparent 50%)`,
              }}
            >
              <header className="px-4 pt-4 pb-3 border-b border-ink-100/80 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: d.accent }}
                  />
                  <h3 className="text-sm font-semibold text-ink-900">
                    {d.name}
                  </h3>
                  <span className="ml-auto text-[11px] text-ink-500">
                    {impacted}/{domainCaps.length} changing
                  </span>
                </div>
              </header>
              <ul className="p-3 space-y-1.5">
                {domainCaps.map((c) => {
                  const change = changesById[c.id];
                  return (
                    <li
                      key={c.id}
                      className="flex items-center gap-2 text-sm py-1"
                    >
                      <span className="text-ink-900 flex-1 truncate">
                        {c.name}
                      </span>
                      {change ? (
                        <ChangeChips change={change} />
                      ) : (
                        <span className="text-[10px] uppercase tracking-wider text-ink-300 font-semibold">
                          Unchanged
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChangeChips({ change }: { change: CapabilityChange }) {
  const counts: [ImpactKind, number][] = [
    ["new", change.newSignals.length],
    ["replace", change.replaceSignals.length],
    ["enhance", change.enhanceSignals.length],
    ["consolidate", change.consolidateSignals.length],
  ];
  return (
    <div className="flex items-center gap-1">
      {counts
        .filter(([, n]) => n > 0)
        .map(([kind, n]) => (
          <span
            key={kind}
            title={`${impactLabel[kind]} × ${n}`}
            className={[
              "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded text-[10px] font-semibold ring-1",
              impactColor[kind],
            ].join(" ")}
          >
            {kind === "new" ? "N" : kind === "enhance" ? "E" : kind === "replace" ? "R" : "C"}
            {n > 1 && <span className="ml-0.5">{n}</span>}
          </span>
        ))}
    </div>
  );
}

function Chip({ kind }: { kind: ImpactKind }) {
  return (
    <span
      className={[
        "inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded text-[9px] font-semibold ring-1 align-middle mx-0.5",
        impactColor[kind],
      ].join(" ")}
    >
      {kind === "new" ? "N" : kind === "enhance" ? "E" : kind === "replace" ? "R" : "C"}
    </span>
  );
}
