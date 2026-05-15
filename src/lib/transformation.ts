import type {
  AdoptionHorizon,
  Capability,
  EmergingCapability,
  ImpactKind,
} from "@/lib/types";
import { capabilities } from "@/data/capabilities";
import { emergingCapabilities } from "@/data/emerging";

export interface CapabilityChange {
  capability: Capability;
  newSignals: EmergingCapability[];
  enhanceSignals: EmergingCapability[];
  replaceSignals: EmergingCapability[];
  consolidateSignals: EmergingCapability[];
  total: number;
  priorityScore: number;
  primaryKind: ImpactKind | null;
}

export interface RoadmapEntry {
  horizon: AdoptionHorizon;
  signals: EmergingCapability[];
}

export interface FutureStateSummary {
  newCount: number;
  enhanceCount: number;
  replaceCount: number;
  consolidateCount: number;
  impactedCapabilities: number;
  totalCapabilities: number;
  totalSignals: number;
}

const KIND_WEIGHT: Record<ImpactKind, number> = {
  new: 1.0,
  replace: 0.9,
  enhance: 0.6,
  consolidate: 0.5,
};

const HORIZON_URGENCY: Record<AdoptionHorizon, number> = {
  now: 1.0,
  next: 0.7,
  later: 0.4,
  watch: 0.2,
};

export function computeCapabilityChanges(): CapabilityChange[] {
  const byId: Record<string, CapabilityChange> = {};
  for (const c of capabilities) {
    byId[c.id] = {
      capability: c,
      newSignals: [],
      enhanceSignals: [],
      replaceSignals: [],
      consolidateSignals: [],
      total: 0,
      priorityScore: 0,
      primaryKind: null,
    };
  }
  for (const sig of emergingCapabilities) {
    for (const imp of sig.impacts) {
      const change = byId[imp.capabilityId];
      if (!change) continue;
      change.total += 1;
      const bucket =
        imp.kind === "new"
          ? change.newSignals
          : imp.kind === "enhance"
            ? change.enhanceSignals
            : imp.kind === "replace"
              ? change.replaceSignals
              : change.consolidateSignals;
      bucket.push(sig);
      change.priorityScore +=
        KIND_WEIGHT[imp.kind] *
        HORIZON_URGENCY[sig.horizon] *
        (0.4 + 0.6 * sig.impact);
    }
  }
  for (const change of Object.values(byId)) {
    change.primaryKind = pickPrimaryKind(change);
  }
  return Object.values(byId)
    .filter((c) => c.total > 0)
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

function pickPrimaryKind(change: CapabilityChange): ImpactKind | null {
  const counts: [ImpactKind, number][] = [
    ["new", change.newSignals.length],
    ["replace", change.replaceSignals.length],
    ["enhance", change.enhanceSignals.length],
    ["consolidate", change.consolidateSignals.length],
  ];
  const winner = counts.reduce((a, b) => (b[1] > a[1] ? b : a));
  return winner[1] > 0 ? winner[0] : null;
}

export function computeRoadmap(): RoadmapEntry[] {
  const horizons: AdoptionHorizon[] = ["now", "next", "later", "watch"];
  return horizons
    .map((horizon) => ({
      horizon,
      signals: emergingCapabilities
        .filter((e) => e.horizon === horizon)
        .sort((a, b) => b.impact - a.impact),
    }))
    .filter((r) => r.signals.length > 0);
}

export function computeFutureStateSummary(): FutureStateSummary {
  const changes = computeCapabilityChanges();
  let newCount = 0;
  let enhanceCount = 0;
  let replaceCount = 0;
  let consolidateCount = 0;
  for (const c of changes) {
    newCount += c.newSignals.length;
    enhanceCount += c.enhanceSignals.length;
    replaceCount += c.replaceSignals.length;
    consolidateCount += c.consolidateSignals.length;
  }
  return {
    newCount,
    enhanceCount,
    replaceCount,
    consolidateCount,
    impactedCapabilities: changes.length,
    totalCapabilities: capabilities.length,
    totalSignals: emergingCapabilities.length,
  };
}
