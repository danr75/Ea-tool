import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AdoptionHorizon, EmergingCapability } from "@/lib/types";
import { percent } from "@/lib/format";

const horizonAccent: Record<AdoptionHorizon, string> = {
  now: "#22c55e",
  next: "#3b82f6",
  later: "#a855f7",
  watch: "#94a3b8",
};

export function EmergingCard({ item }: { item: EmergingCapability }) {
  return (
    <Link
      href={`/emerging/${item.id}`}
      className="group block bg-white rounded-2xl ring-1 ring-ink-100 shadow-card hover:shadow-pop hover:ring-ink-300/60 transition-all p-5"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: horizonAccent[item.horizon] }}
        />
        <span className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
          {item.category}
        </span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-ink-900 leading-tight">
        {item.name}
      </h3>
      <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-3">
        {item.summary}
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
        <Score label="Likelihood" v={item.likelihood} />
        <Score label="Impact" v={item.impact} />
        <Score label="Urgency" v={item.urgency} />
      </dl>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-ink-400">
          Affects {item.impacts.length}{" "}
          {item.impacts.length === 1 ? "capability" : "capabilities"}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-deep">
          Open
          <ArrowRight
            size={12}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}

function Score({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <dt className="text-ink-400 font-medium uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1">
        <div className="h-1 rounded-full bg-ink-100 overflow-hidden">
          <div
            className="h-full bg-ink-900"
            style={{ width: `${Math.round(v * 100)}%` }}
          />
        </div>
        <div className="mt-1 text-ink-700 font-medium">{percent(v)}</div>
      </dd>
    </div>
  );
}
