"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { removeCapability } from "@/app/actions/capabilities";

export function DeleteCapabilityButton({
  capabilityId,
  capabilityName,
  onDeleted,
}: {
  capabilityId: string;
  capabilityName: string;
  onDeleted: (id: string) => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await removeCapability(capabilityId);
      if (result.ok) {
        onDeleted(result.id);
      } else {
        setError(result.error);
        setConfirming(false);
      }
    });
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-signal-replace transition-colors"
      >
        <Trash2 size={11} />
        Delete capability
      </button>
    );
  }

  return (
    <div className="bg-signal-replace/5 ring-1 ring-signal-replace/30 rounded-lg p-3 space-y-2">
      <div className="text-xs text-ink-700 leading-snug">
        Permanently delete <span className="font-semibold">{capabilityName}</span>?
        Relationships and emerging-signal links will lose their reference.
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-signal-replace text-white hover:bg-signal-replace/90 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Trash2 size={11} />
          )}
          Yes, delete
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={pending}
          className="text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100"
        >
          Cancel
        </button>
      </div>
      {error && (
        <div className="text-[11px] text-signal-replace font-medium">
          {error}
        </div>
      )}
    </div>
  );
}
