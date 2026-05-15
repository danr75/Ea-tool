import Link from "next/link";
import { Scale, Users } from "lucide-react";
import type { OperatingModelShifts } from "@/lib/ai-evolution";

export function OperatingModelShiftsPanel({
  shifts,
}: {
  shifts: OperatingModelShifts;
}) {
  return (
    <section className="space-y-3">
      <header>
        <h2 className="text-base font-semibold text-ink-900">
          Operating model shifts
        </h2>
        <p className="text-sm text-ink-500 leading-relaxed">
          The roles, decisions and policies the enterprise needs to add or
          change to absorb AI safely at scale.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        <Panel
          icon={Scale}
          tone="neutral"
          title="Governance and decision changes"
          items={shifts.governanceShifts}
        />
        <Panel
          icon={Users}
          tone="opportunity"
          title="Workforce and skill changes"
          items={shifts.workforceShifts}
        />
      </div>
    </section>
  );
}

function Panel({
  icon: Icon,
  title,
  items,
  tone,
}: {
  icon: typeof Scale;
  title: string;
  items: { signal: { id: string; name: string }; text: string }[];
  tone: "neutral" | "opportunity";
}) {
  const toneStyles =
    tone === "opportunity"
      ? "text-signal-new bg-signal-new/10"
      : "text-ink-600 bg-ink-100";
  // Dedupe by text + signal to avoid noise.
  const seen = new Set<string>();
  const unique = items.filter((i) => {
    const key = `${i.signal.id}::${i.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return (
    <article className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-7 h-7 rounded-lg grid place-items-center ${toneStyles}`}>
          <Icon size={14} strokeWidth={2} />
        </span>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        <span className="ml-auto text-[11px] text-ink-400">{unique.length}</span>
      </div>
      <ul className="space-y-2.5">
        {unique.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span className="shrink-0 w-5 h-5 rounded-full bg-ink-100 text-ink-500 grid place-items-center text-[10px] font-semibold mt-0.5">
              {i + 1}
            </span>
            <div>
              <div className="text-ink-700 leading-relaxed">{it.text}</div>
              <Link
                href={`/emerging/${it.signal.id}`}
                className="text-[11px] text-ink-400 hover:text-ink-700 mt-0.5 inline-block"
              >
                Driven by {it.signal.name}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
