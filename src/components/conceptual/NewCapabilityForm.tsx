"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Plus, X } from "lucide-react";
import type { Capability, DomainId } from "@/lib/types";
import { addCapability } from "@/app/actions/capabilities";

export function NewCapabilityForm({
  domain,
  onCreated,
}: {
  domain: DomainId;
  onCreated: (capability: Capability) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const result = await addCapability(domain, trimmed);
      if (result.ok) {
        onCreated(result.capability);
        setName("");
        setOpen(false);
        setError(null);
      } else {
        setError(result.error);
      }
    });
  };

  const cancel = () => {
    setOpen(false);
    setName("");
    setError(null);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-ink-200 text-xs font-medium text-ink-500 hover:text-ink-900 hover:border-ink-400 hover:bg-white transition-colors"
      >
        <Plus size={12} strokeWidth={2.2} />
        Add capability
      </button>
    );
  }

  return (
    <div className="mt-2 p-2.5 rounded-lg bg-white ring-1 ring-ink-300 space-y-2">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") cancel();
        }}
        maxLength={80}
        disabled={pending}
        placeholder="Capability name"
        className="w-full text-sm text-ink-900 bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded-md px-2 py-1.5 outline-none"
      />
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <span className="text-[11px] text-signal-replace font-medium">
            {error}
          </span>
        ) : (
          <span className="text-[10px] text-ink-400">Enter to add</span>
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
            disabled={pending || !name.trim()}
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
