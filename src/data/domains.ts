import type { Domain } from "@/lib/types";

export const domains: Domain[] = [
  {
    id: "business-service",
    name: "Business & Service",
    shortName: "Business",
    description:
      "Customer, workforce, finance and service delivery capabilities that produce business outcomes.",
    accent: "#0ea5e9",
  },
  {
    id: "data",
    name: "Data",
    shortName: "Data",
    description:
      "Governance, platforms and analytics that turn information into a reusable enterprise asset.",
    accent: "#10b981",
  },
  {
    id: "ai-automation",
    name: "AI & Automation",
    shortName: "AI",
    description:
      "Orchestration, agents, retrieval and assurance for AI-augmented enterprise work.",
    accent: "#8b5cf6",
  },
  {
    id: "technology",
    name: "Technology",
    shortName: "Technology",
    description:
      "Integration, identity, cloud and platform capabilities that everything else runs on.",
    accent: "#f59e0b",
  },
  {
    id: "security-governance",
    name: "Security & Governance",
    shortName: "Security",
    description:
      "Cyber, risk, privacy and policy controls that keep the enterprise trusted and compliant.",
    accent: "#ef4444",
  },
];

export const domainsById = Object.fromEntries(
  domains.map((d) => [d.id, d]),
) as Record<string, Domain>;
