import type { LogicalComponent, LogicalFlow } from "@/lib/types";

export const logicalComponents: LogicalComponent[] = [
  // ----- AI Orchestration -----
  {
    id: "lc-ai-gateway",
    capabilityId: "cap-ai-orchestration",
    name: "AI Gateway",
    kind: "platform",
    description: "Routes prompts to models, enforces policy and budget.",
  },
  {
    id: "lc-model-runtime",
    capabilityId: "cap-ai-orchestration",
    name: "Model Runtime Pool",
    kind: "service",
    description: "Hosted and external foundation models.",
  },
  {
    id: "lc-agent-runtime",
    capabilityId: "cap-ai-orchestration",
    name: "Agent Runtime",
    kind: "service",
    description: "Executes goal-directed agents with tool access.",
  },
  {
    id: "lc-prompt-store",
    capabilityId: "cap-ai-orchestration",
    name: "Prompt & Policy Store",
    kind: "datastore",
    description: "Versioned prompts and policy bundles.",
  },
  {
    id: "lc-retrieval-svc",
    capabilityId: "cap-ai-orchestration",
    name: "Retrieval Service",
    kind: "service",
    description: "Vector + graph retrieval grounding.",
  },
  {
    id: "lc-vector-store",
    capabilityId: "cap-ai-orchestration",
    name: "Vector Store",
    kind: "datastore",
    description: "Embeddings of approved enterprise content.",
  },
  {
    id: "lc-ai-eval",
    capabilityId: "cap-ai-orchestration",
    name: "Evaluation Harness",
    kind: "policy",
    description: "Pre-release and continuous evaluation of model outputs.",
  },
  {
    id: "lc-ai-foundation-ext",
    capabilityId: "cap-ai-orchestration",
    name: "External Foundation Model APIs",
    kind: "external",
  },

  // ----- Integration & APIs -----
  {
    id: "lc-api-gateway",
    capabilityId: "cap-integration",
    name: "API Gateway",
    kind: "platform",
    description: "Public and internal API edge.",
  },
  {
    id: "lc-integration-platform",
    capabilityId: "cap-integration",
    name: "Integration Platform",
    kind: "platform",
    description: "Mapping, transformation and orchestration flows.",
  },
  {
    id: "lc-event-bus",
    capabilityId: "cap-integration",
    name: "Event Bus",
    kind: "platform",
    description: "Domain events and async messaging.",
  },
  {
    id: "lc-api-catalog",
    capabilityId: "cap-integration",
    name: "API Catalog",
    kind: "datastore",
    description: "Inventory and schema for discoverable APIs.",
  },
  {
    id: "lc-api-dev-portal",
    capabilityId: "cap-integration",
    name: "Developer Portal",
    kind: "interface",
    description: "Internal and partner self-service.",
  },

  // ----- Identity & Access -----
  {
    id: "lc-idp",
    capabilityId: "cap-identity",
    name: "Identity Provider",
    kind: "platform",
    description: "Workforce and customer authentication.",
  },
  {
    id: "lc-sso",
    capabilityId: "cap-identity",
    name: "SSO Broker",
    kind: "service",
    description: "Federates internal and SaaS sign-in.",
  },
  {
    id: "lc-mfa",
    capabilityId: "cap-identity",
    name: "Step-up & MFA",
    kind: "service",
  },
  {
    id: "lc-directory",
    capabilityId: "cap-identity",
    name: "Directory & Entitlements",
    kind: "datastore",
    description: "People, roles, groups, scopes.",
  },
  {
    id: "lc-agent-identity",
    capabilityId: "cap-identity",
    name: "Non-Human Identity Registry",
    kind: "service",
    description: "Workload and AI agent principals with scoped permissions.",
  },
  {
    id: "lc-policy-engine",
    capabilityId: "cap-identity",
    name: "Authorization Policy Engine",
    kind: "policy",
    description: "Centralised ABAC/RBAC policy evaluation.",
  },

  // ----- Data Catalogue & Lineage -----
  {
    id: "lc-catalog-svc",
    capabilityId: "cap-data-catalogue",
    name: "Catalog Service",
    kind: "service",
    description: "Searchable inventory of data assets.",
  },
  {
    id: "lc-lineage-collector",
    capabilityId: "cap-data-catalogue",
    name: "Lineage Collector",
    kind: "service",
    description: "Captures lineage from pipelines and BI tools.",
  },
  {
    id: "lc-metadata-store",
    capabilityId: "cap-data-catalogue",
    name: "Metadata Store",
    kind: "datastore",
  },
  {
    id: "lc-classification",
    capabilityId: "cap-data-catalogue",
    name: "Classification Engine",
    kind: "policy",
    description: "Detects and labels sensitive data.",
  },
  {
    id: "lc-catalog-ui",
    capabilityId: "cap-data-catalogue",
    name: "Catalog Experience",
    kind: "interface",
  },

  // ----- Customer Management -----
  {
    id: "lc-crm",
    capabilityId: "cap-customer-mgmt",
    name: "CRM Platform",
    kind: "platform",
    description: "Accounts, contacts, opportunities, cases.",
  },
  {
    id: "lc-customer-360",
    capabilityId: "cap-customer-mgmt",
    name: "Customer 360 Service",
    kind: "service",
    description: "Resolved view across systems.",
  },
  {
    id: "lc-consent-svc",
    capabilityId: "cap-customer-mgmt",
    name: "Consent & Preferences",
    kind: "service",
  },
  {
    id: "lc-cdp-store",
    capabilityId: "cap-customer-mgmt",
    name: "Customer Data Store",
    kind: "datastore",
  },
  {
    id: "lc-contact-channels",
    capabilityId: "cap-customer-mgmt",
    name: "Contact Channels",
    kind: "interface",
    description: "Web, mobile, contact centre, messaging.",
  },

  // ----- Cybersecurity -----
  {
    id: "lc-siem",
    capabilityId: "cap-cyber",
    name: "SIEM",
    kind: "platform",
    description: "Aggregates and correlates security telemetry.",
  },
  {
    id: "lc-soar",
    capabilityId: "cap-cyber",
    name: "SOAR Playbooks",
    kind: "service",
    description: "Automated response orchestration.",
  },
  {
    id: "lc-edr",
    capabilityId: "cap-cyber",
    name: "Endpoint Detection",
    kind: "service",
  },
  {
    id: "lc-threat-intel",
    capabilityId: "cap-cyber",
    name: "Threat Intel Feed",
    kind: "external",
  },
  {
    id: "lc-vuln-mgmt",
    capabilityId: "cap-cyber",
    name: "Vulnerability Management",
    kind: "service",
  },
  {
    id: "lc-incident-store",
    capabilityId: "cap-cyber",
    name: "Incident Record",
    kind: "datastore",
  },
];

export const logicalFlows: LogicalFlow[] = [
  // AI Orchestration internal flows
  { from: "lc-ai-gateway", to: "lc-model-runtime", kind: "calls" },
  { from: "lc-ai-gateway", to: "lc-ai-foundation-ext", kind: "calls" },
  { from: "lc-ai-gateway", to: "lc-prompt-store", kind: "reads" },
  { from: "lc-ai-gateway", to: "lc-agent-runtime", kind: "calls" },
  { from: "lc-agent-runtime", to: "lc-retrieval-svc", kind: "calls" },
  { from: "lc-retrieval-svc", to: "lc-vector-store", kind: "reads" },
  { from: "lc-ai-eval", to: "lc-ai-gateway", kind: "enforces" },
  { from: "lc-ai-eval", to: "lc-model-runtime", kind: "enforces" },

  // Integration internal flows
  { from: "lc-api-gateway", to: "lc-api-catalog", kind: "reads" },
  { from: "lc-api-dev-portal", to: "lc-api-catalog", kind: "reads" },
  { from: "lc-integration-platform", to: "lc-event-bus", kind: "publishes" },
  { from: "lc-integration-platform", to: "lc-api-gateway", kind: "calls" },

  // Identity internal flows
  { from: "lc-sso", to: "lc-idp", kind: "calls" },
  { from: "lc-sso", to: "lc-mfa", kind: "calls" },
  { from: "lc-idp", to: "lc-directory", kind: "reads" },
  { from: "lc-policy-engine", to: "lc-directory", kind: "reads" },
  { from: "lc-agent-identity", to: "lc-policy-engine", kind: "calls" },
  { from: "lc-policy-engine", to: "lc-api-gateway", kind: "enforces" },
  { from: "lc-policy-engine", to: "lc-ai-gateway", kind: "enforces" },

  // Data catalogue internal flows
  { from: "lc-catalog-svc", to: "lc-metadata-store", kind: "reads" },
  { from: "lc-lineage-collector", to: "lc-metadata-store", kind: "writes" },
  { from: "lc-classification", to: "lc-metadata-store", kind: "writes" },
  { from: "lc-catalog-ui", to: "lc-catalog-svc", kind: "calls" },

  // Customer mgmt internal flows
  { from: "lc-customer-360", to: "lc-cdp-store", kind: "reads" },
  { from: "lc-customer-360", to: "lc-crm", kind: "calls" },
  { from: "lc-consent-svc", to: "lc-cdp-store", kind: "writes" },
  { from: "lc-contact-channels", to: "lc-customer-360", kind: "calls" },
  { from: "lc-contact-channels", to: "lc-consent-svc", kind: "calls" },

  // Cybersecurity internal flows
  { from: "lc-edr", to: "lc-siem", kind: "publishes" },
  { from: "lc-threat-intel", to: "lc-siem", kind: "publishes" },
  { from: "lc-vuln-mgmt", to: "lc-siem", kind: "publishes" },
  { from: "lc-siem", to: "lc-soar", kind: "publishes" },
  { from: "lc-soar", to: "lc-incident-store", kind: "writes" },

  // Cross-capability bridges (the high-value part: shows how layers connect)
  { from: "lc-ai-gateway", to: "lc-api-gateway", kind: "calls", label: "tool use" },
  { from: "lc-ai-gateway", to: "lc-policy-engine", kind: "calls", label: "authz" },
  { from: "lc-retrieval-svc", to: "lc-catalog-svc", kind: "reads", label: "discovery" },
  { from: "lc-customer-360", to: "lc-api-gateway", kind: "calls" },
  { from: "lc-customer-360", to: "lc-event-bus", kind: "consumes" },
  { from: "lc-siem", to: "lc-event-bus", kind: "consumes" },
  { from: "lc-classification", to: "lc-cdp-store", kind: "reads", label: "PII scan" },
];

export function logicalForCapability(capabilityId: string) {
  const components = logicalComponents.filter(
    (c) => c.capabilityId === capabilityId,
  );
  const ids = new Set(components.map((c) => c.id));
  const internal = logicalFlows.filter(
    (f) => ids.has(f.from) && ids.has(f.to),
  );
  const incoming = logicalFlows.filter(
    (f) => !ids.has(f.from) && ids.has(f.to),
  );
  const outgoing = logicalFlows.filter(
    (f) => ids.has(f.from) && !ids.has(f.to),
  );
  return { components, internal, incoming, outgoing };
}

export const capabilitiesWithLogical = Array.from(
  new Set(logicalComponents.map((c) => c.capabilityId)),
);
