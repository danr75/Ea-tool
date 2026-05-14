export type DomainId =
  | "business-service"
  | "data"
  | "ai-automation"
  | "technology"
  | "security-governance";

export type ViewLevel = "conceptual" | "logical" | "physical";

export type AppMode =
  | "executive"
  | "architect"
  | "transformation"
  | "ai-evolution";

export type MaturityLevel = "emerging" | "developing" | "established" | "core";

export type ImpactKind = "new" | "enhance" | "replace" | "consolidate";

export type AdoptionHorizon = "now" | "next" | "later" | "watch";

export interface Domain {
  id: DomainId;
  name: string;
  shortName: string;
  description: string;
  accent: string;
}

export interface Capability {
  id: string;
  domain: DomainId;
  name: string;
  summary: string;
  maturity: MaturityLevel;
  reuse: number;
  ownership?: string;
  tags?: string[];
}

export type RelationshipKind =
  | "depends-on"
  | "supports"
  | "shares-data"
  | "governs"
  | "consumes"
  | "delivers-to";

export interface Relationship {
  from: string;
  to: string;
  kind: RelationshipKind;
  strength: number;
}

export interface CapabilityImpact {
  capabilityId: string;
  kind: ImpactKind;
  note: string;
}

export interface EmergingCapability {
  id: string;
  name: string;
  summary: string;
  category: string;
  horizon: AdoptionHorizon;
  likelihood: number;
  impact: number;
  urgency: number;
  maturity: MaturityLevel;
  industries: string[];
  impacts: CapabilityImpact[];
  opportunities: string[];
  risks: string[];
  migrationPath: string[];
  governanceShifts: string[];
  workforceShifts: string[];
}
