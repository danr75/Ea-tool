import type {
  AdoptionHorizon,
  ImpactKind,
  MaturityLevel,
  RelationshipKind,
} from "@/lib/types";

export const horizonLabel: Record<AdoptionHorizon, string> = {
  now: "Adopt now",
  next: "Adopt next",
  later: "Adopt later",
  watch: "Watch",
};

export const horizonOrder: AdoptionHorizon[] = ["now", "next", "later", "watch"];

export const maturityLabel: Record<MaturityLevel, string> = {
  emerging: "Emerging",
  developing: "Developing",
  established: "Established",
  core: "Core",
};

export const impactLabel: Record<ImpactKind, string> = {
  new: "New capability",
  enhance: "Enhances",
  replace: "Replaces",
  consolidate: "Consolidates",
};

export const impactColor: Record<ImpactKind, string> = {
  new: "bg-signal-new/15 text-signal-new ring-signal-new/30",
  enhance: "bg-signal-enhance/15 text-signal-enhance ring-signal-enhance/30",
  replace: "bg-signal-replace/15 text-signal-replace ring-signal-replace/30",
  consolidate:
    "bg-signal-consolidate/15 text-signal-consolidate ring-signal-consolidate/30",
};

export const relationshipLabel: Record<RelationshipKind, string> = {
  "depends-on": "Depends on",
  supports: "Supports",
  "shares-data": "Shares data with",
  governs: "Governs",
  consumes: "Consumes",
  "delivers-to": "Delivers to",
};

export function percent(n: number) {
  return `${Math.round(n * 100)}%`;
}
