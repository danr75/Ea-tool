"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveEmerging } from "@/app/actions/emerging";

type Field = "likelihood" | "impact" | "urgency";

export function EditableScore({
  signalId,
  field,
  value,
  label,
}: {
  signalId: string;
  field: Field;
  value: number;
  label: string;
}) {
  const [draft, setDraft] = useState(value);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const commit = (next: number) => {
    if (next === value) return;
    startTransition(async () => {
      await saveEmerging(signalId, { [field]: next });
      router.refresh();
    });
  };

  return (
    <div className="bg-white rounded-xl ring-1 ring-ink-100 p-3 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] text-ink-400 font-medium uppercase tracking-wider">
          {label}
        </div>
        {pending && <Loader2 size={11} className="animate-spin text-ink-400" />}
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={Math.round(draft * 100)}
        onChange={(e) => setDraft(Number(e.target.value) / 100)}
        onMouseUp={() => commit(draft)}
        onKeyUp={() => commit(draft)}
        onTouchEnd={() => commit(draft)}
        className="mt-1.5 w-full accent-ink-900"
        disabled={pending}
      />
      <div className="mt-1 text-lg font-semibold text-ink-900 tabular-nums">
        {Math.round(draft * 100)}%
      </div>
    </div>
  );
}
