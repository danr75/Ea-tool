"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Check, Loader2, Pencil, X as XIcon } from "lucide-react";
import type { Capability } from "@/lib/types";
import { saveCapabilitySummary } from "@/app/actions/capabilities";

const MAX_LENGTH = 500;

export function EditableSummary({
  capability,
  onCapabilityUpdated,
}: {
  capability: Capability;
  onCapabilityUpdated?: (c: Capability) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(capability.summary);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(capability.summary);
    setEditing(false);
    setError(null);
  }, [capability.id, capability.summary]);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length,
      );
    }
  }, [editing]);

  if (!editing) {
    return (
      <div className="mt-2 group relative">
        <p className="text-sm text-ink-500 leading-relaxed pr-7">
          {capability.summary}
        </p>
        {onCapabilityUpdated && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Edit summary"
            className="absolute top-0 right-0 w-6 h-6 rounded-md grid place-items-center text-ink-300 opacity-0 group-hover:opacity-100 hover:text-ink-900 hover:bg-ink-100 transition-all"
          >
            <Pencil size={11} />
          </button>
        )}
      </div>
    );
  }

  const trimmed = draft.trim();
  const dirty = trimmed !== capability.summary;
  const tooLong = trimmed.length > MAX_LENGTH;
  const empty = trimmed.length === 0;
  const canSave = dirty && !empty && !tooLong && !pending;

  const handleSave = () => {
    if (!canSave) return;
    setError(null);
    startTransition(async () => {
      const result = await saveCapabilitySummary(capability.id, trimmed);
      if (result.ok) {
        onCapabilityUpdated?.(result.capability);
        setEditing(false);
      } else {
        setError(result.error);
      }
    });
  };

  const handleCancel = () => {
    setDraft(capability.summary);
    setEditing(false);
    setError(null);
  };

  return (
    <div className="mt-2 space-y-2">
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") handleCancel();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        }}
        rows={4}
        className="w-full text-sm text-ink-700 leading-relaxed bg-ink-50 ring-1 ring-ink-200 focus:ring-ink-400 focus:bg-white rounded-lg p-2.5 outline-none resize-none"
        disabled={pending}
      />
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-ink-400">
          {trimmed.length}/{MAX_LENGTH}
          {tooLong && (
            <span className="text-signal-replace ml-1.5 font-medium">
              · too long
            </span>
          )}
          <span className="ml-2 text-ink-300">
            ⌘↩ to save · Esc to cancel
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={pending}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100 disabled:opacity-50"
          >
            <XIcon size={11} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            Save
          </button>
        </div>
      </div>
      {error && (
        <div className="text-xs text-signal-replace font-medium">{error}</div>
      )}
    </div>
  );
}
