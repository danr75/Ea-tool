import { getAllEmerging } from "@/lib/db/emerging";
import { EmergingCard } from "@/components/emerging/EmergingCard";
import { EmergingRadar } from "@/components/emerging/EmergingRadar";
import type { AdoptionHorizon } from "@/lib/types";
import { horizonLabel, horizonOrder } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function EmergingPage() {
  const emergingCapabilities = await getAllEmerging();
  const byHorizon = horizonOrder
    .map((h) => ({
      horizon: h,
      items: emergingCapabilities.filter((e) => e.horizon === h),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      <header className="space-y-2 max-w-2xl">
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-400">
          Intelligence · emerging capabilities
        </span>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          What is changing the enterprise next.
        </h1>
        <p className="text-sm text-ink-500 leading-relaxed">
          Scored by likelihood of adoption, enterprise impact and urgency. Open
          any signal to see which existing capabilities it changes, what it
          replaces, and how to introduce it safely.
        </p>
      </header>

      <EmergingRadar items={emergingCapabilities} />

      {byHorizon.map((group) => (
        <HorizonSection key={group.horizon} horizon={group.horizon}>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {group.items.map((e) => (
              <EmergingCard key={e.id} item={e} />
            ))}
          </div>
        </HorizonSection>
      ))}
    </div>
  );
}

function HorizonSection({
  horizon,
  children,
}: {
  horizon: AdoptionHorizon;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
        {horizonLabel[horizon]}
      </h2>
      {children}
    </section>
  );
}
