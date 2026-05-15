"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import type {
  Capability,
  EmergingCapability,
  Relationship,
} from "@/lib/types";
import { domainsById } from "@/data/domains";
import { useArchitectureData } from "@/components/ArchitectureDataProvider";
import {
  impactColor,
  impactLabel,
  maturityLabel,
  percent,
  relationshipLabel,
} from "@/lib/format";
import { removeRelationship as removeRelationshipAction } from "@/app/actions/relationships";
import { EditableSummary } from "./EditableSummary";
import { EditableMaturity } from "./EditableMaturity";
import { EditableOwnership } from "./EditableOwnership";
import { DeleteCapabilityButton } from "./DeleteCapabilityButton";
import { NewRelationshipForm } from "./NewRelationshipForm";

export function CapabilityDetail({
  capability,
  outgoing,
  incoming,
  emerging,
  onClose,
  onCapabilityUpdated,
  onCapabilityDeleted,
}: {
  capability: Capability;
  outgoing: Relationship[];
  incoming: Relationship[];
  emerging: EmergingCapability[];
  onClose: () => void;
  onCapabilityUpdated?: (c: Capability) => void;
  onCapabilityDeleted?: (id: string) => void;
}) {
  const domain = domainsById[capability.domain];
  return (
    <aside className="bg-white rounded-2xl ring-1 ring-ink-100 shadow-pop overflow-hidden flex flex-col h-fit sticky top-24">
      <header className="p-5 border-b border-ink-100 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail"
          className="absolute top-4 right-4 w-7 h-7 rounded-md grid place-items-center text-ink-400 hover:text-ink-900 hover:bg-ink-100 transition-colors"
        >
          <X size={14} />
        </button>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: domain.accent }}
          />
          {domain.name}
        </div>
        <h2 className="mt-2 text-xl font-semibold text-ink-900 pr-8 leading-tight">
          {capability.name}
        </h2>
        <EditableSummary
          capability={capability}
          onCapabilityUpdated={onCapabilityUpdated}
        />
        <dl className="mt-4 grid grid-cols-3 gap-3 text-[11px]">
          <div>
            <dt className="text-ink-400 font-medium uppercase tracking-wider">
              Maturity
            </dt>
            <dd className="mt-1 -ml-1.5">
              <EditableMaturity
                capability={capability}
                onCapabilityUpdated={onCapabilityUpdated}
              />
            </dd>
          </div>
          <div>
            <dt className="text-ink-400 font-medium uppercase tracking-wider">
              Reuse
            </dt>
            <dd className="mt-1 text-ink-900 font-medium">
              {percent(capability.reuse)}
            </dd>
          </div>
          <div className="min-w-0">
            <dt className="text-ink-400 font-medium uppercase tracking-wider">
              Owner
            </dt>
            <dd className="mt-1 truncate">
              <EditableOwnership
                capability={capability}
                onCapabilityUpdated={onCapabilityUpdated}
              />
            </dd>
          </div>
        </dl>
      </header>

      <div className="p-5 space-y-5">
        {emerging.length > 0 && (
          <section>
            <h3 className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium mb-2">
              Emerging signals affecting this capability
            </h3>
            <ul className="space-y-2">
              {emerging.map((e) => {
                const impact = e.impacts.find(
                  (i) => i.capabilityId === capability.id,
                );
                if (!impact) return null;
                return (
                  <li key={e.id}>
                    <Link
                      href={`/emerging/${e.id}`}
                      className="block p-3 rounded-lg ring-1 ring-ink-100 hover:ring-ink-300/60 hover:shadow-card transition-all bg-white"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={[
                            "px-1.5 py-0.5 rounded text-[10px] font-semibold ring-1",
                            impactColor[impact.kind],
                          ].join(" ")}
                        >
                          {impactLabel[impact.kind]}
                        </span>
                        <span className="text-sm font-medium text-ink-900">
                          {e.name}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-ink-500 leading-snug">
                        {impact.note}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <RelationshipList
          title="This capability"
          kinds={outgoing}
          getOther={(r) => r.to}
          arrow="→"
          capability={capability}
          direction="outgoing"
          editable={Boolean(onCapabilityUpdated)}
        />
        <RelationshipList
          title="Supported by"
          kinds={incoming}
          getOther={(r) => r.from}
          arrow="←"
          capability={capability}
          direction="incoming"
          editable={Boolean(onCapabilityUpdated)}
        />

        {onCapabilityDeleted && (
          <div className="pt-3 border-t border-ink-100">
            <DeleteCapabilityButton
              capabilityId={capability.id}
              capabilityName={capability.name}
              onDeleted={onCapabilityDeleted}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

function RelationshipList({
  title,
  kinds,
  getOther,
  arrow,
  capability,
  direction,
  editable,
}: {
  title: string;
  kinds: Relationship[];
  getOther: (r: Relationship) => string;
  arrow: string;
  capability: Capability;
  direction: "outgoing" | "incoming";
  editable: boolean;
}) {
  const { capabilities, capabilitiesById, addRelationship, removeRelationship } =
    useArchitectureData();
  const showEmpty = kinds.length === 0;
  if (showEmpty && !editable) return null;
  return (
    <section>
      <h3 className="text-[11px] uppercase tracking-[0.14em] text-ink-400 font-medium mb-2">
        {title}
      </h3>
      {showEmpty ? (
        <p className="text-[11px] text-ink-400 italic">
          No {direction} relationships yet.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {kinds.map((r, i) => {
            const other = capabilitiesById[getOther(r)];
            const otherDomain = other ? domainsById[other.domain] : null;
            if (!other) return null;
            return (
              <li
                key={`${r.from}-${r.to}-${r.kind}-${i}`}
                className="flex items-center gap-2 text-sm group"
              >
                <span className="text-ink-300 font-mono text-xs w-3 text-center">
                  {arrow}
                </span>
                <span className="text-[11px] font-medium text-ink-400 uppercase tracking-wider w-24 shrink-0">
                  {relationshipLabel[r.kind]}
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: otherDomain?.accent }}
                />
                <span className="text-ink-900 font-medium flex-1 truncate">
                  {other.name}
                </span>
                {editable && (
                  <RemoveRelationshipButton
                    from={r.from}
                    to={r.to}
                    kind={r.kind}
                    onRemoved={removeRelationship}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
      {editable && (
        <NewRelationshipForm
          currentCapability={capability}
          capabilities={capabilities}
          direction={direction}
          onCreated={addRelationship}
        />
      )}
    </section>
  );
}

function RemoveRelationshipButton({
  from,
  to,
  kind,
  onRemoved,
}: {
  from: string;
  to: string;
  kind: Relationship["kind"];
  onRemoved: (from: string, to: string, kind: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="Remove relationship"
      onClick={() => {
        startTransition(async () => {
          const result = await removeRelationshipAction({ from, to, kind });
          if (result.ok) {
            onRemoved(result.removed.from, result.removed.to, result.removed.kind);
          }
        });
      }}
      disabled={pending}
      className="w-5 h-5 rounded grid place-items-center text-ink-300 opacity-0 group-hover:opacity-100 hover:text-signal-replace hover:bg-signal-replace/10 transition-all disabled:opacity-100"
    >
      {pending ? <Loader2 size={11} className="animate-spin" /> : <X size={11} />}
    </button>
  );
}
