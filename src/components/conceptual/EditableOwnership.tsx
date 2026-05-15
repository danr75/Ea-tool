"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Pencil } from "lucide-react";
import type { Capability } from "@/lib/types";
import { saveCapabilityOwnership } from "@/app/actions/capabilities";

export function EditableOwnership({
  capability,
  onCapabilityUpdated,
}: {
  capability: Capability;
  onCapabilityUpdated?: (c: Capability) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(capability.ownership ?? "");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(capability.ownership ?? "");
    setEditing(false);
    setError(null);
  }, [capability.id, capability.ownership]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed === (capability.ownership ?? "")) {
      setEditing(false);
      return;
    }
    startTransition(async () => {
      const result = await saveCapabilityOwnership(capability.id, trimmed);
      if (result.ok) {
        onCapabilityUpdated?.(result.capability);
        setError(null);
        setEditing(false);
      } else {
        setError(result.error);
      }
    });
  };

  const cancel = () => {
    setDraft(capability.ownership ?? "");
    setEditing(false);
    setError(null);
  };

  if (!editing) {
    const display = capability.ownership ?? "—";
    return (
      <button
        type="button"
        onClick={() => onCapabilityUpdated && setEditing(true)}
        disabled={!onCapabilityUpdated}
        title={onCapabilityUpdated ? "Edit ownership" : undefined}
        className={[
          "inline-flex items-center gap-1 text-ink-900 font-medium text-[11px] group max-w-full",
          onCapabilityUpdated ? "cursor-pointer" : "cursor-default",
        ].join(" ")}
      >
        <span className="truncate">{display}</span>
        {onCapabilityUpdated && (
          <Pencil
            size={9}
            strokeWidth={2.2}
            className="text-ink-300 opacity-0 group-hover:opacity-100 shrink-0"
          />
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        maxLength={120}
        disabled={pending}
        placeholder="e.g. CIO"
        className="w-full text-[11px] font-medium text-ink-900 bg-white ring-1 ring-ink-300 focus:ring-ink-500 rounded px-1.5 py-0.5 outline-none"
      />
      {pending && (
        <Loader2 size={9} className="animate-spin text-ink-400" />
      )}
      {error && (
        <div className="text-[10px] text-signal-replace">{error}</div>
      )}
    </div>
  );
}
