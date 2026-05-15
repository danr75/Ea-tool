import type {
  Capability,
  DomainId,
  EmergingCapability,
  ImpactKind,
} from "@/lib/types";
import { capabilities, capabilitiesById } from "@/data/capabilities";
import { domains } from "@/data/domains";
import { emergingCapabilities } from "@/data/emerging";

const HORIZON_URGENCY = { now: 1, next: 0.7, later: 0.4, watch: 0.2 } as const;
const KIND_WEIGHT: Record<ImpactKind, number> = {
  new: 1,
  replace: 0.9,
  enhance: 0.6,
  consolidate: 0.5,
};

export function isAiSignal(signal: EmergingCapability): boolean {
  if (signal.category === "AI") return true;
  for (const imp of signal.impacts) {
    const cap = capabilitiesById[imp.capabilityId];
    if (cap?.domain === "ai-automation") return true;
  }
  return ["em-vector-db", "em-knowledge-graph"].includes(signal.id);
}

export function aiSignals(): EmergingCapability[] {
  return emergingCapabilities.filter(isAiSignal);
}

export interface DomainAiImpact {
  domainId: DomainId;
  capabilitiesImpacted: number;
  totalCapabilities: number;
  signalsTouching: number;
  weightedScore: number;
}

export function computeDomainImpact(): DomainAiImpact[] {
  const signals = aiSignals();
  return domains.map((d) => {
    const domainCaps = capabilities.filter((c) => c.domain === d.id);
    const touchedCapIds = new Set<string>();
    const signalIds = new Set<string>();
    let weighted = 0;
    for (const sig of signals) {
      for (const imp of sig.impacts) {
        const cap = capabilitiesById[imp.capabilityId];
        if (cap?.domain !== d.id) continue;
        touchedCapIds.add(cap.id);
        signalIds.add(sig.id);
        weighted +=
          KIND_WEIGHT[imp.kind] *
          HORIZON_URGENCY[sig.horizon] *
          (0.4 + 0.6 * sig.impact);
      }
    }
    return {
      domainId: d.id,
      capabilitiesImpacted: touchedCapIds.size,
      totalCapabilities: domainCaps.length,
      signalsTouching: signalIds.size,
      weightedScore: weighted,
    };
  });
}

export interface MandatoryCapability {
  capability: Capability;
  introducedBy: EmergingCapability[];
  notes: string[];
}

export function computeMandatoryCapabilities(): MandatoryCapability[] {
  const signals = aiSignals();
  const byCap: Record<string, MandatoryCapability> = {};
  for (const sig of signals) {
    for (const imp of sig.impacts) {
      if (imp.kind !== "new") continue;
      const cap = capabilitiesById[imp.capabilityId];
      if (!cap) continue;
      const entry = (byCap[cap.id] ??= {
        capability: cap,
        introducedBy: [],
        notes: [],
      });
      entry.introducedBy.push(sig);
      entry.notes.push(imp.note);
    }
  }
  return Object.values(byCap).sort(
    (a, b) => b.introducedBy.length - a.introducedBy.length,
  );
}

export interface ReshapedCapability {
  capability: Capability;
  enhancedBy: EmergingCapability[];
  replacedBy: EmergingCapability[];
  consolidatedBy: EmergingCapability[];
  notes: { kind: ImpactKind; signal: string; note: string }[];
  score: number;
}

export function computeReshapedCapabilities(): ReshapedCapability[] {
  const signals = aiSignals();
  const byCap: Record<string, ReshapedCapability> = {};
  for (const sig of signals) {
    for (const imp of sig.impacts) {
      if (imp.kind === "new") continue;
      const cap = capabilitiesById[imp.capabilityId];
      if (!cap) continue;
      const entry = (byCap[cap.id] ??= {
        capability: cap,
        enhancedBy: [],
        replacedBy: [],
        consolidatedBy: [],
        notes: [],
        score: 0,
      });
      if (imp.kind === "enhance") entry.enhancedBy.push(sig);
      if (imp.kind === "replace") entry.replacedBy.push(sig);
      if (imp.kind === "consolidate") entry.consolidatedBy.push(sig);
      entry.notes.push({ kind: imp.kind, signal: sig.name, note: imp.note });
      entry.score +=
        KIND_WEIGHT[imp.kind] *
        HORIZON_URGENCY[sig.horizon] *
        (0.4 + 0.6 * sig.impact);
    }
  }
  return Object.values(byCap).sort((a, b) => b.score - a.score);
}

export interface AiHeadline {
  aiSignalCount: number;
  totalSignalCount: number;
  mandatoryCount: number;
  reshapedCount: number;
  nowHorizon: number;
  domainsTouched: number;
  totalDomains: number;
}

export function computeAiHeadline(): AiHeadline {
  const signals = aiSignals();
  const mandatory = computeMandatoryCapabilities();
  const reshaped = computeReshapedCapabilities();
  const now = signals.filter((s) => s.horizon === "now").length;
  const domainImpact = computeDomainImpact();
  const touched = domainImpact.filter((d) => d.capabilitiesImpacted > 0).length;
  return {
    aiSignalCount: signals.length,
    totalSignalCount: emergingCapabilities.length,
    mandatoryCount: mandatory.length,
    reshapedCount: reshaped.length,
    nowHorizon: now,
    domainsTouched: touched,
    totalDomains: domains.length,
  };
}

export interface OperatingModelShifts {
  governanceShifts: { signal: EmergingCapability; text: string }[];
  workforceShifts: { signal: EmergingCapability; text: string }[];
}

export function computeOperatingModelShifts(): OperatingModelShifts {
  const signals = aiSignals();
  const governance: { signal: EmergingCapability; text: string }[] = [];
  const workforce: { signal: EmergingCapability; text: string }[] = [];
  for (const sig of signals) {
    for (const g of sig.governanceShifts) governance.push({ signal: sig, text: g });
    for (const w of sig.workforceShifts) workforce.push({ signal: sig, text: w });
  }
  return { governanceShifts: governance, workforceShifts: workforce };
}
