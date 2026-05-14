import type { EmergingCapability } from "@/lib/types";

export const emergingCapabilities: EmergingCapability[] = [
  {
    id: "em-ai-agents",
    name: "Enterprise AI Agents",
    summary:
      "Goal-directed AI workers that perform multi-step tasks against enterprise systems with policy and oversight.",
    category: "AI",
    horizon: "now",
    likelihood: 0.95,
    impact: 0.9,
    urgency: 0.85,
    maturity: "emerging",
    industries: ["Financial Services", "Public Sector", "Health", "Retail"],
    impacts: [
      {
        capabilityId: "cap-service-delivery",
        kind: "enhance",
        note: "Agents handle tier-1 service queries and back-office tasks end-to-end.",
      },
      {
        capabilityId: "cap-automation",
        kind: "replace",
        note: "Replaces brittle RPA scripts with goal-directed agent workflows.",
      },
      {
        capabilityId: "cap-agent-platform",
        kind: "new",
        note: "Introduces a new platform capability for building and operating agents.",
      },
      {
        capabilityId: "cap-identity",
        kind: "enhance",
        note: "Identity must extend to non-human agent principals with scoped permissions.",
      },
      {
        capabilityId: "cap-ai-governance",
        kind: "enhance",
        note: "Agent actions need policy, evaluation and audit beyond model outputs.",
      },
    ],
    opportunities: [
      "Reduce service handling cost while improving response times.",
      "Free expert staff from repetitive cross-system work.",
      "Compose new internal products from existing systems without custom builds.",
    ],
    risks: [
      "Unconstrained agent actions causing data, financial or reputational harm.",
      "Identity sprawl as agents proliferate across teams.",
      "Vendor lock-in around proprietary agent runtimes.",
    ],
    migrationPath: [
      "Stand up an agent platform with policy and observability before scaling use.",
      "Pilot in a bounded back-office workflow with human-in-the-loop.",
      "Replace existing RPA flows incrementally as agent reliability matures.",
      "Federate agent identities into the enterprise IAM model.",
    ],
    governanceShifts: [
      "Define a non-human identity model and approval flow.",
      "Establish an agent action policy and audit standard.",
      "Add an evaluation gate to the change management process for agents.",
    ],
    workforceShifts: [
      "Service teams shift from execution to agent supervision and exception handling.",
      "New roles: agent designer, agent SRE, agent risk lead.",
    ],
  },
  {
    id: "em-mcp",
    name: "Model Context Protocol (MCP)",
    summary:
      "Open protocol for connecting AI assistants and agents to enterprise data, tools and systems with consistent permissions.",
    category: "AI",
    horizon: "now",
    likelihood: 0.85,
    impact: 0.7,
    urgency: 0.75,
    maturity: "emerging",
    industries: ["All sectors"],
    impacts: [
      {
        capabilityId: "cap-integration",
        kind: "enhance",
        note: "Adds an AI-native integration pattern alongside REST, events and ETL.",
      },
      {
        capabilityId: "cap-ai-orchestration",
        kind: "enhance",
        note: "Lets orchestrators discover and call enterprise tools through a standard.",
      },
      {
        capabilityId: "cap-identity",
        kind: "enhance",
        note: "Identity must scope MCP tool access per assistant, per user, per task.",
      },
    ],
    opportunities: [
      "Avoid bespoke per-vendor AI integrations.",
      "Expose existing APIs to assistants without rebuilding them.",
      "Standardise audit of AI tool use.",
    ],
    risks: [
      "Over-broad tool exposure if scoping is weak.",
      "Protocol churn as the standard evolves.",
    ],
    migrationPath: [
      "Inventory candidate tools that AI should reach (read first, then write).",
      "Stand up an MCP gateway with identity, logging and rate limiting.",
      "Wrap a small set of high-value internal APIs as MCP servers.",
      "Roll out to assistants behind feature flags.",
    ],
    governanceShifts: [
      "Per-tool risk classification and approval flow.",
      "Logging standard for assistant-initiated tool calls.",
    ],
    workforceShifts: [
      "Integration engineers add MCP server design to their remit.",
    ],
  },
  {
    id: "em-vector-db",
    name: "Vector Databases & Semantic Layer",
    summary:
      "Embedding-based stores and semantic models that let systems retrieve by meaning, not just keyword.",
    category: "Data",
    horizon: "now",
    likelihood: 0.9,
    impact: 0.7,
    urgency: 0.7,
    maturity: "developing",
    industries: ["Financial Services", "Health", "Legal", "Public Sector"],
    impacts: [
      {
        capabilityId: "cap-retrieval",
        kind: "new",
        note: "Introduces retrieval as a first-class enterprise capability.",
      },
      {
        capabilityId: "cap-knowledge-mgmt",
        kind: "enhance",
        note: "Unstructured corporate knowledge becomes machine-usable.",
      },
      {
        capabilityId: "cap-data-catalogue",
        kind: "enhance",
        note: "Catalogue extends to embeddings, chunking and semantic models.",
      },
    ],
    opportunities: [
      "Unlock long-tail unstructured knowledge for AI assistants.",
      "Replace brittle keyword search with semantic retrieval.",
    ],
    risks: [
      "Sensitive data leaking via embeddings without classification.",
      "Quality drift if chunking and ingestion are unmanaged.",
    ],
    migrationPath: [
      "Pick one high-value corpus and one retrieval pattern.",
      "Add classification-aware ingestion before scaling sources.",
      "Operationalise evaluation of retrieval quality.",
    ],
    governanceShifts: [
      "Classify and label content before embedding.",
      "Extend data lineage to embeddings and chunks.",
    ],
    workforceShifts: [
      "Knowledge stewards add semantic curation to their role.",
    ],
  },
  {
    id: "em-knowledge-graph",
    name: "Enterprise Knowledge Graph",
    summary:
      "A connected, queryable model of enterprise entities and relationships that grounds AI and analytics.",
    category: "Data",
    horizon: "next",
    likelihood: 0.7,
    impact: 0.8,
    urgency: 0.55,
    maturity: "developing",
    industries: ["Financial Services", "Public Sector", "Health", "Manufacturing"],
    impacts: [
      {
        capabilityId: "cap-master-data",
        kind: "enhance",
        note: "Graph extends master data with rich relationships and context.",
      },
      {
        capabilityId: "cap-retrieval",
        kind: "enhance",
        note: "Graph retrieval complements vector retrieval for precise answers.",
      },
      {
        capabilityId: "cap-decision-support",
        kind: "enhance",
        note: "Executives can query relationships rather than read reports.",
      },
    ],
    opportunities: [
      "Answer cross-domain questions that no single system can answer.",
      "Provide AI with a reliable model of enterprise reality.",
    ],
    risks: [
      "High up-front modelling cost without clear product value.",
      "Graph becomes a shadow source of truth if ungoverned.",
    ],
    migrationPath: [
      "Start with a domain slice tied to a real decision (e.g. risk).",
      "Federate from existing systems rather than re-mastering.",
      "Operationalise as a service consumed by AI and analytics.",
    ],
    governanceShifts: [
      "Graph schema ownership and change control.",
      "Quality measures for relationship truth, not just entity quality.",
    ],
    workforceShifts: [
      "Add ontology and graph engineering skills to the data team.",
    ],
  },
  {
    id: "em-platform-eng",
    name: "Platform Engineering & Internal Developer Platforms",
    summary:
      "Curated self-service platforms that let product teams ship safely without rebuilding infra each time.",
    category: "Technology",
    horizon: "now",
    likelihood: 0.8,
    impact: 0.65,
    urgency: 0.6,
    maturity: "developing",
    industries: ["All sectors"],
    impacts: [
      {
        capabilityId: "cap-cloud",
        kind: "enhance",
        note: "Cloud platform exposes paved paths instead of raw primitives.",
      },
      {
        capabilityId: "cap-observability",
        kind: "consolidate",
        note: "Observability becomes a built-in default of the platform.",
      },
      {
        capabilityId: "cap-integration",
        kind: "enhance",
        note: "Integration patterns become reusable platform templates.",
      },
    ],
    opportunities: [
      "Reduce lead time for new services from months to days.",
      "Lift baseline security and reliability across all teams.",
    ],
    risks: [
      "Platform team becomes a bottleneck if treated as a project, not a product.",
      "Paved paths ignored if developer experience is poor.",
    ],
    migrationPath: [
      "Treat the platform as an internal product with a roadmap and users.",
      "Start with one paved path that removes the most painful work.",
      "Measure adoption and developer satisfaction, not just uptime.",
    ],
    governanceShifts: [
      "Standards live in the platform, not in PDFs.",
      "Architecture review shifts left into platform defaults.",
    ],
    workforceShifts: [
      "Infra engineers move into product-style platform roles.",
    ],
  },
  {
    id: "em-ai-governance",
    name: "AI Governance Platforms",
    summary:
      "Tooling for policy, evaluation, monitoring and incident management of AI systems and agents.",
    category: "Security & Governance",
    horizon: "now",
    likelihood: 0.9,
    impact: 0.75,
    urgency: 0.8,
    maturity: "emerging",
    industries: ["Financial Services", "Public Sector", "Health"],
    impacts: [
      {
        capabilityId: "cap-ai-governance",
        kind: "new",
        note: "Introduces tooling that operationalises a previously documentary capability.",
      },
      {
        capabilityId: "cap-ai-monitoring",
        kind: "enhance",
        note: "Adds drift, harm and policy violation detection beyond uptime metrics.",
      },
      {
        capabilityId: "cap-risk",
        kind: "enhance",
        note: "Enterprise risk extends to model and agent risk taxonomies.",
      },
      {
        capabilityId: "cap-compliance",
        kind: "enhance",
        note: "Evidence collection for regulators becomes continuous, not annual.",
      },
    ],
    opportunities: [
      "Enable AI scale-up with regulator-ready evidence.",
      "Detect AI incidents before they reach customers.",
    ],
    risks: [
      "Governance tooling that slows delivery without reducing real risk.",
      "Tool sprawl across model, agent and data domains.",
    ],
    migrationPath: [
      "Define the AI risk taxonomy before choosing tooling.",
      "Start with monitoring and evaluation; layer in policy enforcement.",
      "Integrate with enterprise risk and incident processes.",
    ],
    governanceShifts: [
      "Single AI risk register across model, agent and data risks.",
      "Continuous assurance replaces periodic review.",
    ],
    workforceShifts: [
      "Risk and assurance teams gain AI-specific specialists.",
    ],
  },
];

export const emergingById = Object.fromEntries(
  emergingCapabilities.map((e) => [e.id, e]),
) as Record<string, EmergingCapability>;
