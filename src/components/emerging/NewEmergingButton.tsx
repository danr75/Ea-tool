"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, X } from "lucide-react";
import { addEmerging } from "@/app/actions/emerging";
import type { AdoptionHorizon, MaturityLevel } from "@/lib/types";

export function NewEmergingButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("AI");
  const [horizon, setHorizon] = useState<AdoptionHorizon>("next");
  const [maturity, setMaturity] = useState<MaturityLevel>("emerging");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }
    startTransition(async () => {
      const result = await addEmerging({
        name: trimmed,
        summary: "",
        category,
        horizon,
        likelihood: 0.5,
        impact: 0.5,
        urgency: 0.5,
        maturity,
      });
      if (result.ok) {
        router.push(`/emerging/${result.id}`);
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
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ink-900 text-white text-sm font-medium hover:bg-ink-800 shadow-card"
      >
        <Plus size={14} />
        New signal
      </button>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white ring-1 ring-ink-300 shadow-pop w-[320px] space-y-2">
      <div className="text-xs uppercase tracking-[0.14em] text-ink-400 font-semibold">
        New emerging signal
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Signal name"
        autoFocus
        disabled={pending}
        className="w-full text-sm text-ink-900 bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded-md px-2 py-1.5 outline-none"
      />
      <div className="grid grid-cols-3 gap-1.5">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={pending}
          className="text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-1.5 py-1 outline-none"
        >
          <option>AI</option>
          <option>Data</option>
          <option>Technology</option>
          <option>Security &amp; Governance</option>
          <option>Business</option>
        </select>
        <select
          value={horizon}
          onChange={(e) => setHorizon(e.target.value as AdoptionHorizon)}
          disabled={pending}
          className="text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-1.5 py-1 outline-none"
        >
          <option value="now">Now</option>
          <option value="next">Next</option>
          <option value="later">Later</option>
          <option value="watch">Watch</option>
        </select>
        <select
          value={maturity}
          onChange={(e) => setMaturity(e.target.value as MaturityLevel)}
          disabled={pending}
          className="text-xs bg-white ring-1 ring-ink-200 focus:ring-ink-500 rounded px-1.5 py-1 outline-none"
        >
          <option value="emerging">Emerging</option>
          <option value="developing">Developing</option>
          <option value="established">Established</option>
          <option value="core">Core</option>
        </select>
      </div>
      {error && (
        <div className="text-[11px] text-signal-replace font-medium">
          {error}
        </div>
      )}
      <div className="flex items-center gap-1.5 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
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
          className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300 disabled:cursor-not-allowed"
        >
          {pending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <Plus size={11} />
          )}
          Create
        </button>
      </div>
    </div>
  );
}
