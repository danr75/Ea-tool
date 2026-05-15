"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveEmerging } from "@/app/actions/emerging";
import type { AdoptionHorizon, MaturityLevel } from "@/lib/types";
import { horizonLabel, maturityLabel } from "@/lib/format";

const HORIZONS: AdoptionHorizon[] = ["now", "next", "later", "watch"];
const MATURITIES: MaturityLevel[] = [
  "emerging",
  "developing",
  "established",
  "core",
];

export function EditableHorizon({
  signalId,
  value,
}: {
  signalId: string;
  value: AdoptionHorizon;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <label className="inline-flex items-center gap-1.5">
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value as AdoptionHorizon;
          startTransition(async () => {
            await saveEmerging(signalId, { horizon: next });
            router.refresh();
          });
        }}
        disabled={pending}
        className="bg-transparent text-[11px] uppercase tracking-[0.14em] font-medium text-ink-700 cursor-pointer hover:text-ink-900 outline-none"
      >
        {HORIZONS.map((h) => (
          <option key={h} value={h}>
            {horizonLabel[h]}
          </option>
        ))}
      </select>
      {pending && <Loader2 size={10} className="animate-spin text-ink-400" />}
    </label>
  );
}

export function EditableEmergingMaturity({
  signalId,
  value,
}: {
  signalId: string;
  value: MaturityLevel;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <label className="inline-flex items-center gap-1.5">
      <select
        value={value}
        onChange={(e) => {
          const next = e.target.value as MaturityLevel;
          startTransition(async () => {
            await saveEmerging(signalId, { maturity: next });
            router.refresh();
          });
        }}
        disabled={pending}
        className="bg-transparent text-[11px] uppercase tracking-[0.14em] font-medium text-ink-700 cursor-pointer hover:text-ink-900 outline-none"
      >
        {MATURITIES.map((m) => (
          <option key={m} value={m}>
            {maturityLabel[m]} maturity
          </option>
        ))}
      </select>
      {pending && <Loader2 size={10} className="animate-spin text-ink-400" />}
    </label>
  );
}
