import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReshapedCapability } from "@/lib/ai-evolution";
import { domainsById } from "@/data/domains";
import { impactColor, impactLabel } from "@/lib/format";

export function ReshapedCapabilities({
  items,
}: {
  items: ReshapedCapability[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold text-ink-900">
          Existing capabilities becoming unrecognisable
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          Capabilities you already operate that AI is fundamentally changing
          — enhancing what they do, replacing how they do it, or consolidating
          neighbouring tools.
        </p>
      </header>
      <ol className="space-y-2">
        {items.map((r) => {
          const cap = r.capability;
          const dom = domainsById[cap.domain];
          return (
            <li
              key={cap.id}
              className="bg-white rounded-xl ring-1 ring-ink-100 shadow-card"
            >
              <Link
                href={`/architecture?view=conceptual&capability=${cap.id}`}
                className="block p-4 hover:bg-ink-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: dom.accent }}
                      />
                      {dom.shortName}
                    </div>
                    <h3 className="text-sm font-semibold text-ink-900 mt-0.5">
                      {cap.name}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {r.notes.map((n, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span
                            className={[
                              "shrink-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded text-[10px] font-semibold ring-1",
                              impactColor[n.kind],
                            ].join(" ")}
                          >
                            {n.kind === "enhance"
                              ? "E"
                              : n.kind === "replace"
                                ? "R"
                                : "C"}
                          </span>
                          <span className="text-ink-600 leading-relaxed">
                            <span className="font-medium text-ink-700">
                              {n.signal}
                            </span>{" "}
                            <span className="text-ink-400">
                              {impactLabel[n.kind].toLowerCase()}
                            </span>
                            {" — "}
                            {n.note}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ArrowRight size={14} className="text-ink-300 mt-2 shrink-0" />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
