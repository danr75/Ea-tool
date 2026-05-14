import Link from "next/link";
import { ArrowRight, Layers, Radar, Workflow } from "lucide-react";
import { capabilities } from "@/data/capabilities";
import { domains } from "@/data/domains";
import { emergingCapabilities } from "@/data/emerging";
import { relationships } from "@/data/relationships";

const stats = [
  {
    label: "Capabilities",
    value: capabilities.length,
    hint: "across five enterprise domains",
  },
  {
    label: "Relationships",
    value: relationships.length,
    hint: "modelled between capabilities",
  },
  {
    label: "Emerging signals",
    value: emergingCapabilities.length,
    hint: "scored for impact and urgency",
  },
  {
    label: "Domains",
    value: domains.length,
    hint: "business, data, AI, tech, governance",
  },
];

const tiles = [
  {
    href: "/architecture",
    title: "Conceptual architecture",
    description:
      "Navigate the capability landscape across business, data, AI, technology and governance.",
    icon: Layers,
    cta: "Open capability map",
  },
  {
    href: "/emerging",
    title: "Emerging capabilities",
    description:
      "See what is arriving, how urgent it is, and which existing capabilities it changes.",
    icon: Radar,
    cta: "Open intelligence radar",
  },
  {
    href: "/architecture",
    title: "Relationships",
    description:
      "Trace dependencies between capabilities to understand impact before you act.",
    icon: Workflow,
    cta: "Explore relationships",
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="space-y-3 max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-new" />
            Vertical slice · validating the visual language
          </span>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-ink-900 leading-tight">
            Understand, explore and evolve your enterprise architecture.
          </h1>
          <p className="text-lg text-ink-500 leading-relaxed">
            A living view of the capabilities that run the organisation —
            connected to the emerging technology, data and AI shifts that are
            about to reshape them.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl p-4 ring-1 ring-ink-100 shadow-card"
            >
              <div className="text-2xl font-semibold text-ink-900">
                {s.value}
              </div>
              <div className="text-xs font-medium text-ink-500 mt-1">
                {s.label}
              </div>
              <div className="text-[11px] text-ink-400 mt-0.5 leading-snug">
                {s.hint}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.title}
              href={tile.href}
              className="group bg-white rounded-2xl p-6 ring-1 ring-ink-100 shadow-card hover:shadow-pop hover:ring-ink-300/60 transition-all"
            >
              <span className="w-10 h-10 rounded-xl bg-ink-900 text-white grid place-items-center shadow-card">
                <Icon size={18} strokeWidth={2} />
              </span>
              <h2 className="mt-5 text-lg font-semibold text-ink-900">
                {tile.title}
              </h2>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed">
                {tile.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep">
                {tile.cta}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
