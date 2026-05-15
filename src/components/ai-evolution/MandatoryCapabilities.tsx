import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { MandatoryCapability } from "@/lib/ai-evolution";
import { domainsById } from "@/data/domains";
import { maturityLabel } from "@/lib/format";
import { maturityColor } from "@/components/shell/OverlayToggle";

export function MandatoryCapabilities({
  items,
}: {
  items: MandatoryCapability[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold text-ink-900">
          Capabilities becoming mandatory
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          New enterprise capabilities introduced by AI-driven signals. Each is
          a function you didn&rsquo;t need at scale a few years ago that now
          gates safe AI adoption.
        </p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => {
          const cap = m.capability;
          const dom = domainsById[cap.domain];
          return (
            <article
              key={cap.id}
              className="relative bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5 overflow-hidden"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1"
                style={{ background: maturityColor[cap.maturity] }}
              />
              <div className="pl-2">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: dom.accent }}
                  />
                  {dom.name}
                  <span className="text-ink-200">·</span>
                  <span>{maturityLabel[cap.maturity]} today</span>
                </div>
                <h3 className="mt-2 text-base font-semibold text-ink-900 leading-tight">
                  {cap.name}
                </h3>
                <p className="mt-1.5 text-xs text-ink-500 leading-relaxed">
                  {cap.summary}
                </p>
                <div className="mt-3">
                  <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold mb-1.5">
                    Introduced by
                  </div>
                  <ul className="space-y-1.5">
                    {m.introducedBy.map((sig, i) => (
                      <li key={sig.id}>
                        <Link
                          href={`/emerging/${sig.id}`}
                          className="inline-flex items-start gap-1.5 text-xs text-ink-700 hover:text-ink-900 group"
                        >
                          <Sparkles
                            size={11}
                            strokeWidth={2.2}
                            className="text-signal-replace mt-0.5 shrink-0"
                          />
                          <span>
                            <span className="font-medium">{sig.name}</span>
                            {m.notes[i] && (
                              <span className="text-ink-500 ml-1">
                                — {m.notes[i]}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href={`/architecture?view=conceptual&capability=${cap.id}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-accent-deep"
                >
                  See in capability map
                  <ArrowRight size={11} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
