import type { Capability, CapabilityImpact } from "@/lib/types";
import { domainsById } from "@/data/domains";
import { impactColor, impactLabel } from "@/lib/format";

export function ImpactMap({
  impacts,
  capabilitiesById,
}: {
  impacts: CapabilityImpact[];
  capabilitiesById: Record<string, Capability>;
}) {
  const grouped = impacts.reduce(
    (acc, i) => {
      (acc[i.kind] ??= []).push(i);
      return acc;
    },
    {} as Record<string, CapabilityImpact[]>,
  );
  const order: CapabilityImpact["kind"][] = [
    "new",
    "enhance",
    "replace",
    "consolidate",
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {order
        .filter((k) => grouped[k])
        .map((kind) => (
          <div
            key={kind}
            className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-card p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <span
                className={[
                  "px-1.5 py-0.5 rounded text-[10px] font-semibold ring-1",
                  impactColor[kind],
                ].join(" ")}
              >
                {impactLabel[kind]}
              </span>
              <span className="text-[11px] text-ink-400">
                {grouped[kind].length}{" "}
                {grouped[kind].length === 1 ? "capability" : "capabilities"}
              </span>
            </div>
            <ul className="space-y-3">
              {grouped[kind].map((i) => {
                const cap = capabilitiesById[i.capabilityId];
                const dom = cap ? domainsById[cap.domain] : null;
                if (!cap) return null;
                return (
                  <li key={i.capabilityId} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: dom?.accent }}
                    />
                    <div>
                      <div className="text-sm font-medium text-ink-900">
                        {cap.name}
                      </div>
                      <div className="text-[11px] text-ink-400 mt-0.5">
                        {dom?.name}
                      </div>
                      <div className="text-xs text-ink-500 mt-1.5 leading-relaxed">
                        {i.note}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
    </div>
  );
}
