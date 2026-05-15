import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  Sparkles,
  Route,
  Scale,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getEmergingById } from "@/lib/db/emerging";
import { getAllCapabilities } from "@/lib/db/capabilities";
import { EditableImpactMap } from "@/components/emerging/EditableImpactMap";
import { EditableEmergingText } from "@/components/emerging/EditableText";
import { EditableScore } from "@/components/emerging/EditableScore";
import {
  EditableEmergingMaturity,
  EditableHorizon,
} from "@/components/emerging/EditableEmergingSelect";
import { DeleteEmergingButton } from "@/components/emerging/DeleteEmergingButton";

export const dynamic = "force-dynamic";

export default async function EmergingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, capabilities] = await Promise.all([
    getEmergingById(id),
    getAllCapabilities(),
  ]);
  if (!item) notFound();
  const capabilitiesById = Object.fromEntries(capabilities.map((c) => [c.id, c]));

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/emerging"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft size={12} />
          Back to emerging
        </Link>
      </div>

      <header className="space-y-3 max-w-3xl">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
          <EditableEmergingText
            signalId={item.id}
            field="category"
            value={item.category}
            textClassName="inline"
            className="inline-block"
          />
          <span className="text-ink-200">·</span>
          <EditableHorizon signalId={item.id} value={item.horizon} />
          <span className="text-ink-200">·</span>
          <EditableEmergingMaturity signalId={item.id} value={item.maturity} />
        </div>
        <EditableEmergingText
          signalId={item.id}
          field="name"
          value={item.name}
          textClassName="text-3xl md:text-4xl font-semibold tracking-tight text-ink-900 leading-tight"
        />
        <EditableEmergingText
          signalId={item.id}
          field="summary"
          value={item.summary}
          multiline
          textClassName="text-base text-ink-500 leading-relaxed"
        />
        <dl className="grid grid-cols-3 max-w-xl gap-3 pt-2">
          <EditableScore
            signalId={item.id}
            field="likelihood"
            value={item.likelihood}
            label="Likelihood"
          />
          <EditableScore
            signalId={item.id}
            field="impact"
            value={item.impact}
            label="Impact"
          />
          <EditableScore
            signalId={item.id}
            field="urgency"
            value={item.urgency}
            label="Urgency"
          />
        </dl>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.industries.map((ind) => (
            <span
              key={ind}
              className="text-[11px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600 font-medium"
            >
              {ind}
            </span>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <SectionHeader title="How it changes the architecture" />
        <EditableImpactMap
          signalId={item.id}
          impacts={item.impacts}
          capabilities={capabilities}
          capabilitiesById={capabilitiesById}
        />
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <ListPanel
          icon={Sparkles}
          tone="opportunity"
          title="Opportunities"
          items={item.opportunities}
        />
        <ListPanel
          icon={AlertTriangle}
          tone="risk"
          title="Risks"
          items={item.risks}
        />
        <ListPanel
          icon={Route}
          tone="neutral"
          title="Migration path"
          items={item.migrationPath}
          ordered
        />
        <ListPanel
          icon={Scale}
          tone="neutral"
          title="Governance shifts"
          items={item.governanceShifts}
        />
      </div>

      <ListPanel
        icon={Users}
        tone="neutral"
        title="Workforce and skill impacts"
        items={item.workforceShifts}
      />

      <div className="pt-4 border-t border-ink-100">
        <DeleteEmergingButton signalId={item.id} signalName={item.name} />
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
      {title}
    </h2>
  );
}

function ListPanel({
  icon: Icon,
  title,
  items,
  tone,
  ordered,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
  tone: "opportunity" | "risk" | "neutral";
  ordered?: boolean;
}) {
  const toneStyles = {
    opportunity: "text-signal-new bg-signal-new/10",
    risk: "text-signal-replace bg-signal-replace/10",
    neutral: "text-ink-600 bg-ink-100",
  } as const;
  return (
    <section className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-7 h-7 rounded-lg grid place-items-center ${toneStyles[tone]}`}
        >
          <Icon size={14} strokeWidth={2} />
        </span>
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
      </div>
      <ol className="space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span
              className={[
                "shrink-0 w-5 h-5 rounded-full grid place-items-center text-[10px] font-semibold mt-0.5",
                ordered
                  ? "bg-ink-900 text-white"
                  : "bg-ink-100 text-ink-500",
              ].join(" ")}
            >
              {ordered ? i + 1 : "·"}
            </span>
            <span className="text-ink-700 leading-relaxed">{it}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
