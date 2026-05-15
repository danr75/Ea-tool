"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import type {
  Capability,
  CapabilityImpact,
  ImpactKind,
} from "@/lib/types";
import { domainsById } from "@/data/domains";
import { impactColor, impactLabel } from "@/lib/format";
import { addImpact, removeImpact } from "@/app/actions/emerging";

const KIND_OPTIONS: ImpactKind[] = ["new", "enhance", "replace", "consolidate"];

export function EditableImpactMap({
  signalId,
  impacts,
  capabilities,
  capabilitiesById,
}: {
  signalId: string;
  impacts: CapabilityImpact[];
  capabilities: Capability[];
  capabilitiesById: Record<string, Capability>;
}) {
  const router = useRouter();
  const grouped = impacts.reduce(
    (acc, i) => {
      (acc[i.kind] ??= []).push(i);
      return acc;
    },
    {} as Record<string, CapabilityImpact[]>,
  );
  const order: ImpactKind[] = ["new", "enhance", "replace", "consolidate"];
  const usedCapIds = new Set(impacts.map((i) => i.capabilityId));
  const candidates = capabilities.filter((c) => !usedCapIds.has(c.id));

  return (
    <div className="space-y-4">
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
                    <li
                      key={i.capabilityId}
                      className="flex items-start gap-3 group"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: dom?.accent }}
                      />
                      <div className="flex-1">
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
                      <RemoveImpactButton
                        signalId={signalId}
                        capabilityId={i.capabilityId}
                        onRemoved={() => router.refresh()}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
      </div>
      <AddImpactForm
        signalId={signalId}
        candidates={candidates}
        onAdded={() => router.refresh()}
      />
    </div>
  );
}

function RemoveImpactButton({
  signalId,
  capabilityId,
  onRemoved,
}: {
  signalId: string;
  capabilityId: string;
  onRemoved: () => void;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      aria-label="Remove impact"
      onClick={() =>
        startTransition(async () => {
          const result = await removeImpact({ signalId, capabilityId });
          if (result.ok) onRemoved();
        })
      }
      disabled={pending}
      className="shrink-0 w-6 h-6 rounded grid place-items-center text-ink-300 opacity-0 group-hover:opacity-100 hover:text-signal-replace hover:bg-signal-replace/10 transition-all disabled:opacity-100"
    >
      {pending ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
    </button>
  );
}

function AddImpactForm({
  signalId,
  candidates,
  onAdded,
}: {
  signalId: string;
  candidates: Capability[];
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [capabilityId, setCapabilityId] = useState("");
  const [kind, setKind] = useState<ImpactKind>("enhance");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const submit = () => {
    if (!capabilityId) {
      setError("Pick a capability.");
      return;
    }
    if (!note.trim()) {
      setError("Note is required.");
      return;
    }
    startTransition(async () => {
      const result = await addImpact({
        signalId,
        capabilityId,
        kind,
        note: note.trim(),
      });
      if (result.ok) {
        setOpen(false);
        setCapabilityId("");
        setNote("");
        setError(null);
        onAdded();
      } else {
        setError(result.error);
      }
    });
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-ink-200 text-sm font-medium text-ink-500 hover:text-ink-900 hover:border-ink-400 hover:bg-white"
      >
        <Plus size={12} />
        Add impacted capability
      </button>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white ring-1 ring-ink-300 shadow-card space-y-2 max-w-2xl">
      <div className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
        New impact link
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as ImpactKind)}
          disabled={pending}
          className="text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
        >
          {KIND_OPTIONS.map((k) => (
            <option key={k} value={k}>
              {impactLabel[k]}
            </option>
          ))}
        </select>
        <select
          value={capabilityId}
          onChange={(e) => setCapabilityId(e.target.value)}
          disabled={pending}
          className="text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1.5 outline-none"
        >
          <option value="">Pick a capability…</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="How this signal affects the capability"
        disabled={pending}
        className="w-full text-sm bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded p-2 outline-none resize-none"
      />
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <span className="text-[11px] text-signal-replace font-medium">
            {error}
          </span>
        ) : (
          <span className="text-[11px] text-ink-400" />
        )}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setError(null);
            }}
            disabled={pending}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100"
          >
            <X size={11} />
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300"
          >
            {pending ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Plus size={11} />
            )}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
