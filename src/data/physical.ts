import type { PhysicalComponent, PhysicalDependency } from "@/lib/types";

export const physicalComponents: PhysicalComponent[] = [
  // ----- AI Orchestration -----
  {
    id: "px-azure-apim-ai",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-ai-gateway",
    name: "Azure API Management",
    vendor: "Microsoft",
    kind: "gateway",
    host: "azure",
    description: "Fronts all AI traffic with auth, throttling and audit.",
  },
  {
    id: "px-azure-openai",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-model-runtime",
    name: "Azure OpenAI",
    vendor: "Microsoft / OpenAI",
    kind: "platform",
    host: "azure",
  },
  {
    id: "px-aws-bedrock",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-model-runtime",
    name: "AWS Bedrock",
    vendor: "Amazon",
    kind: "platform",
    host: "aws",
  },
  {
    id: "px-agent-eks",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-agent-runtime",
    name: "Agent Runtime (EKS)",
    vendor: "Internal · AWS EKS",
    kind: "compute",
    host: "aws",
  },
  {
    id: "px-prompt-repo",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-prompt-store",
    name: "Prompt + Policy Repo",
    vendor: "GitHub",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-retrieval-svc",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-retrieval-svc",
    name: "Retrieval Microservice",
    vendor: "Internal · AWS EKS",
    kind: "compute",
    host: "aws",
  },
  {
    id: "px-pinecone",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-vector-store",
    name: "Pinecone",
    vendor: "Pinecone",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-langsmith",
    capabilityId: "cap-ai-orchestration",
    logicalComponentId: "lc-ai-eval",
    name: "LangSmith",
    vendor: "LangChain",
    kind: "saas-app",
    host: "saas",
  },

  // ----- Integration & APIs -----
  {
    id: "px-kong",
    capabilityId: "cap-integration",
    logicalComponentId: "lc-api-gateway",
    name: "Kong Gateway",
    vendor: "Kong · AWS EKS",
    kind: "gateway",
    host: "aws",
  },
  {
    id: "px-mulesoft",
    capabilityId: "cap-integration",
    logicalComponentId: "lc-integration-platform",
    name: "MuleSoft Anypoint",
    vendor: "Salesforce",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-eventbridge",
    capabilityId: "cap-integration",
    logicalComponentId: "lc-event-bus",
    name: "AWS EventBridge",
    vendor: "Amazon",
    kind: "messaging",
    host: "aws",
  },
  {
    id: "px-msk",
    capabilityId: "cap-integration",
    logicalComponentId: "lc-event-bus",
    name: "Kafka (Amazon MSK)",
    vendor: "Amazon",
    kind: "messaging",
    host: "aws",
  },
  {
    id: "px-backstage",
    capabilityId: "cap-integration",
    logicalComponentId: "lc-api-dev-portal",
    name: "Backstage Dev Portal",
    vendor: "Internal · AWS EKS",
    kind: "compute",
    host: "aws",
  },

  // ----- Identity & Access -----
  {
    id: "px-entra",
    capabilityId: "cap-identity",
    logicalComponentId: "lc-idp",
    name: "Microsoft Entra ID",
    vendor: "Microsoft",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-entra-sso",
    capabilityId: "cap-identity",
    logicalComponentId: "lc-sso",
    name: "Entra SSO",
    vendor: "Microsoft",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-authenticator",
    capabilityId: "cap-identity",
    logicalComponentId: "lc-mfa",
    name: "Microsoft Authenticator",
    vendor: "Microsoft",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-vault",
    capabilityId: "cap-identity",
    logicalComponentId: "lc-agent-identity",
    name: "HashiCorp Vault",
    vendor: "HashiCorp",
    kind: "security",
    host: "aws",
  },
  {
    id: "px-opa",
    capabilityId: "cap-identity",
    logicalComponentId: "lc-policy-engine",
    name: "Open Policy Agent",
    vendor: "Internal · AWS EKS",
    kind: "compute",
    host: "aws",
  },

  // ----- Data Catalogue -----
  {
    id: "px-collibra",
    capabilityId: "cap-data-catalogue",
    logicalComponentId: "lc-catalog-svc",
    name: "Collibra",
    vendor: "Collibra",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-openlineage",
    capabilityId: "cap-data-catalogue",
    logicalComponentId: "lc-lineage-collector",
    name: "OpenLineage Collectors",
    vendor: "OSS · AWS EKS",
    kind: "compute",
    host: "aws",
  },
  {
    id: "px-metadata-rds",
    capabilityId: "cap-data-catalogue",
    logicalComponentId: "lc-metadata-store",
    name: "Metadata Postgres (RDS)",
    vendor: "Amazon",
    kind: "datastore",
    host: "aws",
  },
  {
    id: "px-purview",
    capabilityId: "cap-data-catalogue",
    logicalComponentId: "lc-classification",
    name: "Microsoft Purview",
    vendor: "Microsoft",
    kind: "saas-app",
    host: "saas",
  },

  // ----- Customer Management -----
  {
    id: "px-salesforce",
    capabilityId: "cap-customer-mgmt",
    logicalComponentId: "lc-crm",
    name: "Salesforce CRM",
    vendor: "Salesforce",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-c360-eks",
    capabilityId: "cap-customer-mgmt",
    logicalComponentId: "lc-customer-360",
    name: "Customer 360 Service",
    vendor: "Internal · AWS EKS",
    kind: "compute",
    host: "aws",
  },
  {
    id: "px-onetrust",
    capabilityId: "cap-customer-mgmt",
    logicalComponentId: "lc-consent-svc",
    name: "OneTrust Consent",
    vendor: "OneTrust",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-snowflake",
    capabilityId: "cap-customer-mgmt",
    logicalComponentId: "lc-cdp-store",
    name: "Snowflake (customer schema)",
    vendor: "Snowflake",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-twilio",
    capabilityId: "cap-customer-mgmt",
    logicalComponentId: "lc-contact-channels",
    name: "Twilio Messaging",
    vendor: "Twilio",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-genesys",
    capabilityId: "cap-customer-mgmt",
    logicalComponentId: "lc-contact-channels",
    name: "Genesys Cloud CX",
    vendor: "Genesys",
    kind: "saas-app",
    host: "saas",
  },

  // ----- Cybersecurity -----
  {
    id: "px-splunk-siem",
    capabilityId: "cap-cyber",
    logicalComponentId: "lc-siem",
    name: "Splunk Cloud (SIEM)",
    vendor: "Splunk",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-splunk-soar",
    capabilityId: "cap-cyber",
    logicalComponentId: "lc-soar",
    name: "Splunk SOAR",
    vendor: "Splunk",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-crowdstrike",
    capabilityId: "cap-cyber",
    logicalComponentId: "lc-edr",
    name: "CrowdStrike Falcon",
    vendor: "CrowdStrike",
    kind: "security",
    host: "saas",
  },
  {
    id: "px-falcon-agents",
    capabilityId: "cap-cyber",
    logicalComponentId: "lc-edr",
    name: "Falcon Endpoint Agents",
    vendor: "CrowdStrike",
    kind: "device",
    host: "edge",
  },
  {
    id: "px-mandiant",
    capabilityId: "cap-cyber",
    logicalComponentId: "lc-threat-intel",
    name: "Mandiant Advantage",
    vendor: "Google",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-qualys",
    capabilityId: "cap-cyber",
    logicalComponentId: "lc-vuln-mgmt",
    name: "Qualys VMDR",
    vendor: "Qualys",
    kind: "saas-app",
    host: "saas",
  },
  {
    id: "px-snow-sir",
    capabilityId: "cap-cyber",
    logicalComponentId: "lc-incident-store",
    name: "ServiceNow SIR",
    vendor: "ServiceNow",
    kind: "saas-app",
    host: "saas",
  },
];

export const physicalDependencies: PhysicalDependency[] = [
  // AI Orchestration
  { from: "px-azure-apim-ai", to: "px-azure-openai", kind: "calls" },
  { from: "px-azure-apim-ai", to: "px-aws-bedrock", kind: "calls" },
  { from: "px-azure-apim-ai", to: "px-agent-eks", kind: "calls" },
  { from: "px-azure-apim-ai", to: "px-prompt-repo", kind: "reads" },
  { from: "px-agent-eks", to: "px-retrieval-svc", kind: "calls" },
  { from: "px-retrieval-svc", to: "px-pinecone", kind: "reads" },
  { from: "px-langsmith", to: "px-azure-apim-ai", kind: "secures", label: "evals" },

  // Integration
  { from: "px-kong", to: "px-msk", kind: "publishes" },
  { from: "px-mulesoft", to: "px-eventbridge", kind: "publishes" },
  { from: "px-mulesoft", to: "px-kong", kind: "calls" },

  // Identity
  { from: "px-entra-sso", to: "px-entra", kind: "calls" },
  { from: "px-entra-sso", to: "px-authenticator", kind: "calls" },
  { from: "px-vault", to: "px-opa", kind: "calls" },
  { from: "px-opa", to: "px-kong", kind: "secures" },
  { from: "px-opa", to: "px-azure-apim-ai", kind: "secures" },

  // Data catalogue
  { from: "px-collibra", to: "px-metadata-rds", kind: "reads" },
  { from: "px-openlineage", to: "px-metadata-rds", kind: "writes" },
  { from: "px-purview", to: "px-metadata-rds", kind: "writes" },

  // Customer mgmt
  { from: "px-c360-eks", to: "px-snowflake", kind: "reads" },
  { from: "px-c360-eks", to: "px-salesforce", kind: "calls" },
  { from: "px-onetrust", to: "px-snowflake", kind: "writes" },
  { from: "px-twilio", to: "px-c360-eks", kind: "calls" },
  { from: "px-genesys", to: "px-c360-eks", kind: "calls" },

  // Cybersecurity
  { from: "px-falcon-agents", to: "px-crowdstrike", kind: "publishes" },
  { from: "px-crowdstrike", to: "px-splunk-siem", kind: "publishes" },
  { from: "px-mandiant", to: "px-splunk-siem", kind: "publishes" },
  { from: "px-qualys", to: "px-splunk-siem", kind: "publishes" },
  { from: "px-splunk-siem", to: "px-splunk-soar", kind: "publishes" },
  { from: "px-splunk-soar", to: "px-snow-sir", kind: "writes" },

  // Cross-capability bridges
  { from: "px-azure-apim-ai", to: "px-kong", kind: "calls", label: "tool use" },
  { from: "px-c360-eks", to: "px-kong", kind: "calls" },
  { from: "px-c360-eks", to: "px-eventbridge", kind: "consumes" },
  { from: "px-splunk-siem", to: "px-eventbridge", kind: "consumes" },
];

export function physicalForCapability(capabilityId: string) {
  const components = physicalComponents.filter(
    (c) => c.capabilityId === capabilityId,
  );
  const ids = new Set(components.map((c) => c.id));
  const internal = physicalDependencies.filter(
    (d) => ids.has(d.from) && ids.has(d.to),
  );
  const incoming = physicalDependencies.filter(
    (d) => !ids.has(d.from) && ids.has(d.to),
  );
  const outgoing = physicalDependencies.filter(
    (d) => ids.has(d.from) && !ids.has(d.to),
  );
  return { components, internal, incoming, outgoing };
}

export const capabilitiesWithPhysical = Array.from(
  new Set(physicalComponents.map((c) => c.capabilityId)),
);
