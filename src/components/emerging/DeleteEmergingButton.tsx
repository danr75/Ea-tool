"use client";

import { useState, useTransition } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { removeEmerging } from "@/app/actions/emerging";

export function DeleteEmergingButton({
  signalId,
  signalName,
}: {
  signalId: string;
  signalName: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-signal-replace transition-colors"
      >
        <Trash2 size={12} />
        Delete signal
      </button>
    );
  }

  return (
    <div className="bg-signal-replace/5 ring-1 ring-signal-replace/30 rounded-lg p-3 inline-flex items-center gap-2">
      <span className="text-xs text-ink-700">
        Delete <span className="font-semibold">{signalName}</span>?
      </span>
      <button
        type="button"
        onClick={() =>
          startTransition(async () => {
            await removeEmerging(signalId);
          })
        }
        disabled={pending}
        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-signal-replace text-white hover:bg-signal-replace/90 disabled:opacity-60"
      >
        {pending ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Trash2 size={11} />
        )}
        Yes
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
  );
}
