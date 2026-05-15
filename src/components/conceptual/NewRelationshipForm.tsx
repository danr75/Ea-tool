"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Plus, X } from "lucide-react";
import type {
  Capability,
  Relationship,
  RelationshipKind,
} from "@/lib/types";
import { relationshipLabel } from "@/lib/format";
import { addRelationship } from "@/app/actions/relationships";

const KINDS: RelationshipKind[] = [
  "depends-on",
  "supports",
  "shares-data",
  "governs",
  "consumes",
  "delivers-to",
];

type Direction = "outgoing" | "incoming";

export function NewRelationshipForm({
  currentCapability,
  capabilities,
  direction,
  onCreated,
}: {
  currentCapability: Capability;
  capabilities: Capability[];
  direction: Direction;
  onCreated: (r: Relationship) => void;
}) {
  const [open, setOpen] = useState(false);
  const [otherId, setOtherId] = useState("");
  const [kind, setKind] = useState<RelationshipKind>(
    direction === "outgoing" ? "depends-on" : "supports",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (open && selectRef.current) selectRef.current.focus();
  }, [open]);

  const candidates = capabilities.filter(
    (c) => c.id !== currentCapability.id,
  );

  const submit = () => {
    if (!otherId) {
      setError("Pick a capability.");
      return;
    }
    const from = direction === "outgoing" ? currentCapability.id : otherId;
    const to = direction === "outgoing" ? otherId : currentCapability.id;
    startTransition(async () => {
      const result = await addRelationship({ from, to, kind });
      if (result.ok) {
        onCreated(result.relationship);
        setOpen(false);
        setOtherId("");
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  const cancel = () => {
    setOpen(false);
    setOtherId("");
    setError(null);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-ink-500 hover:text-ink-900"
      >
        <Plus size={11} />
        Add {direction === "outgoing" ? "outgoing" : "incoming"} relationship
      </button>
    );
  }

  return (
    <div className="mt-2 p-2.5 rounded-lg bg-white ring-1 ring-ink-300 space-y-2">
      <div className="space-y-1.5">
        <select
          value={kind}
          onChange={(e) => setKind(e.target.value as RelationshipKind)}
          disabled={pending}
          className="w-full text-xs text-ink-900 bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1 outline-none"
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {relationshipLabel[k]}
            </option>
          ))}
        </select>
        <select
          ref={selectRef}
          value={otherId}
          onChange={(e) => setOtherId(e.target.value)}
          disabled={pending}
          className="w-full text-xs text-ink-900 bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-2 py-1 outline-none"
        >
          <option value="">
            {direction === "outgoing"
              ? "Pick the target capability…"
              : "Pick the source capability…"}
          </option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <span className="text-[11px] text-signal-replace font-medium">
            {error}
          </span>
        ) : (
          <span className="text-[10px] text-ink-400" />
        )}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={cancel}
            disabled={pending}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100"
          >
            <X size={11} />
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pending || !otherId}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
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
