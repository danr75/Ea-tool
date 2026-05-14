import type { Relationship } from "@/lib/types";

export const relationships: Relationship[] = [
  // Data underpins business
  { from: "cap-analytics", to: "cap-decision-support", kind: "supports", strength: 0.9 },
  { from: "cap-master-data", to: "cap-customer-mgmt", kind: "supports", strength: 0.8 },
  { from: "cap-master-data", to: "cap-finance", kind: "supports", strength: 0.85 },
  { from: "cap-data-governance", to: "cap-data-quality", kind: "governs", strength: 0.9 },
  { from: "cap-data-governance", to: "cap-data-catalogue", kind: "governs", strength: 0.8 },
  { from: "cap-data-catalogue", to: "cap-analytics", kind: "supports", strength: 0.7 },

  // AI consumes data
  { from: "cap-retrieval", to: "cap-knowledge-mgmt", kind: "consumes", strength: 0.9 },
  { from: "cap-retrieval", to: "cap-data-catalogue", kind: "consumes", strength: 0.7 },
  { from: "cap-ai-orchestration", to: "cap-retrieval", kind: "depends-on", strength: 0.9 },
  { from: "cap-ai-orchestration", to: "cap-agent-platform", kind: "supports", strength: 0.85 },
  { from: "cap-ai-governance", to: "cap-ai-orchestration", kind: "governs", strength: 0.95 },
  { from: "cap-ai-governance", to: "cap-agent-platform", kind: "governs", strength: 0.9 },
  { from: "cap-ai-monitoring", to: "cap-ai-orchestration", kind: "supports", strength: 0.8 },
  { from: "cap-automation", to: "cap-agent-platform", kind: "consumes", strength: 0.7 },

  // AI delivers to business
  { from: "cap-ai-orchestration", to: "cap-decision-support", kind: "delivers-to", strength: 0.8 },
  { from: "cap-automation", to: "cap-service-delivery", kind: "delivers-to", strength: 0.75 },
  { from: "cap-agent-platform", to: "cap-service-delivery", kind: "delivers-to", strength: 0.7 },

  // Technology underpins everything
  { from: "cap-integration", to: "cap-analytics", kind: "supports", strength: 0.7 },
  { from: "cap-integration", to: "cap-ai-orchestration", kind: "supports", strength: 0.75 },
  { from: "cap-integration", to: "cap-service-delivery", kind: "supports", strength: 0.7 },
  { from: "cap-cloud", to: "cap-ai-orchestration", kind: "supports", strength: 0.9 },
  { from: "cap-cloud", to: "cap-analytics", kind: "supports", strength: 0.85 },
  { from: "cap-cloud", to: "cap-enterprise-apps", kind: "supports", strength: 0.8 },
  { from: "cap-identity", to: "cap-ai-orchestration", kind: "governs", strength: 0.85 },
  { from: "cap-identity", to: "cap-agent-platform", kind: "governs", strength: 0.9 },
  { from: "cap-identity", to: "cap-enterprise-apps", kind: "governs", strength: 0.9 },
  { from: "cap-observability", to: "cap-ai-monitoring", kind: "supports", strength: 0.7 },

  // Security & governance overlays
  { from: "cap-cyber", to: "cap-identity", kind: "governs", strength: 0.8 },
  { from: "cap-cyber", to: "cap-cloud", kind: "governs", strength: 0.85 },
  { from: "cap-privacy", to: "cap-customer-mgmt", kind: "governs", strength: 0.85 },
  { from: "cap-privacy", to: "cap-data-governance", kind: "governs", strength: 0.8 },
  { from: "cap-risk", to: "cap-ai-governance", kind: "supports", strength: 0.75 },
  { from: "cap-compliance", to: "cap-records", kind: "depends-on", strength: 0.8 },
  { from: "cap-zero-trust", to: "cap-identity", kind: "depends-on", strength: 0.85 },
];

export function relationshipsFor(capabilityId: string) {
  const outgoing = relationships.filter((r) => r.from === capabilityId);
  const incoming = relationships.filter((r) => r.to === capabilityId);
  return { outgoing, incoming };
}
