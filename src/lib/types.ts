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

export type LogicalComponentKind =
  | "service"
  | "platform"
  | "datastore"
  | "interface"
  | "external"
  | "policy";

export interface LogicalComponent {
  id: string;
  capabilityId: string;
  name: string;
  kind: LogicalComponentKind;
  description?: string;
}

export type LogicalFlowKind =
  | "calls"
  | "publishes"
  | "consumes"
  | "reads"
  | "writes"
  | "enforces";

export interface LogicalFlow {
  from: string;
  to: string;
  kind: LogicalFlowKind;
  label?: string;
}

export type PhysicalHost =
  | "aws"
  | "azure"
  | "gcp"
  | "saas"
  | "on-prem"
  | "edge";

export type PhysicalKind =
  | "compute"
  | "datastore"
  | "platform"
  | "saas-app"
  | "gateway"
  | "messaging"
  | "security"
  | "device";

export interface PhysicalComponent {
  id: string;
  capabilityId: string;
  logicalComponentId?: string;
  name: string;
  vendor?: string;
  kind: PhysicalKind;
  host: PhysicalHost;
  description?: string;
}

export type PhysicalDependencyKind =
  | "calls"
  | "reads"
  | "writes"
  | "publishes"
  | "consumes"
  | "secures"
  | "hosts";

export interface PhysicalDependency {
  from: string;
  to: string;
  kind: PhysicalDependencyKind;
  label?: string;
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
