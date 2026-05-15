"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { saveEmerging } from "@/app/actions/emerging";

type Field = "name" | "summary" | "category";

export function EditableEmergingText({
  signalId,
  field,
  value,
  multiline = false,
  className = "",
  placeholder,
  textClassName = "",
}: {
  signalId: string;
  field: Field;
  value: string;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  textClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
    setEditing(false);
    setError(null);
  }, [signalId, value, field]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if ("select" in inputRef.current) inputRef.current.select();
    }
  }, [editing]);

  const trimmed = draft.trim();
  const dirty = trimmed !== value;
  const empty = trimmed.length === 0;
  const canSave = dirty && !empty && !pending;

  const handleSave = () => {
    if (!canSave) return;
    setError(null);
    startTransition(async () => {
      const result = await saveEmerging(signalId, { [field]: trimmed });
      if (result.ok) {
        setEditing(false);
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
    setError(null);
  };

  if (!editing) {
    return (
      <div className={`group relative ${className}`}>
        <div className={textClassName}>{value}</div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label="Edit"
          className="absolute top-0 right-0 w-6 h-6 rounded-md grid place-items-center text-ink-300 opacity-0 group-hover:opacity-100 hover:text-ink-900 hover:bg-ink-100 transition-all"
        >
          <Pencil size={11} />
        </button>
      </div>
    );
  }

  const InputEl = multiline ? "textarea" : "input";

  return (
    <div className={`${className} space-y-2`}>
      <InputEl
        // @ts-expect-error union element ref
        ref={inputRef}
        value={draft}
        onChange={(e) =>
          setDraft((e.target as HTMLInputElement | HTMLTextAreaElement).value)
        }
        onKeyDown={(e) => {
          if (e.key === "Escape") handleCancel();
          if (
            (e.key === "Enter" && !multiline) ||
            (e.key === "Enter" && (e.metaKey || e.ctrlKey))
          ) {
            handleSave();
          }
        }}
        rows={multiline ? 4 : undefined}
        placeholder={placeholder}
        disabled={pending}
        className="w-full bg-white ring-1 ring-ink-300 focus:ring-ink-500 rounded-lg p-2 outline-none text-sm text-ink-900 resize-none"
      />
      <div className="flex items-center justify-between gap-2">
        {error ? (
          <span className="text-[11px] text-signal-replace font-medium">
            {error}
          </span>
        ) : (
          <span className="text-[11px] text-ink-400">
            {multiline ? "⌘↩ to save" : "↩ to save"} · Esc to cancel
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCancel}
            disabled={pending}
            className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ring-1 ring-ink-200 text-ink-600 hover:bg-ink-100"
          >
            <X size={11} />
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300 disabled:cursor-not-allowed transition-colors"
          >
            {pending ? (
              <Loader2 size={11} className="animate-spin" />
            ) : (
              <Check size={11} />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
