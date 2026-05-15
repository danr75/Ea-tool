import { PrismaClient } from "@prisma/client";
import { capabilities } from "../src/data/capabilities";
import { relationships } from "../src/data/relationships";
import { emergingCapabilities } from "../src/data/emerging";
import { logicalComponents, logicalFlows } from "../src/data/logical";
import { physicalComponents, physicalDependencies } from "../src/data/physical";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding...");

  // Wipe child tables first so a re-seed doesn't leave duplicates with
  // different autoincrement ids. Capabilities are upserted to preserve any
  // user edits, but the relational graph is fully reseeded.
  await prisma.physicalDependency.deleteMany();
  await prisma.physicalComponent.deleteMany();
  await prisma.logicalFlow.deleteMany();
  await prisma.logicalComponent.deleteMany();
  await prisma.emergingImpact.deleteMany();
  await prisma.emergingCapability.deleteMany();
  await prisma.relationship.deleteMany();

  console.log(`  Capabilities: ${capabilities.length}`);
  for (const c of capabilities) {
    await prisma.capability.upsert({
      where: { id: c.id },
      create: {
        id: c.id,
        domain: c.domain,
        name: c.name,
        summary: c.summary,
        maturity: c.maturity,
        reuse: c.reuse,
        ownership: c.ownership ?? null,
      },
      update: {
        domain: c.domain,
        name: c.name,
        summary: c.summary,
        maturity: c.maturity,
        reuse: c.reuse,
        ownership: c.ownership ?? null,
      },
    });
  }

  console.log(`  Relationships: ${relationships.length}`);
  for (const r of relationships) {
    await prisma.relationship.create({
      data: {
        fromId: r.from,
        toId: r.to,
        kind: r.kind,
        strength: r.strength,
      },
    });
  }

  console.log(`  Emerging capabilities: ${emergingCapabilities.length}`);
  for (const e of emergingCapabilities) {
    await prisma.emergingCapability.create({
      data: {
        id: e.id,
        name: e.name,
        summary: e.summary,
        category: e.category,
        horizon: e.horizon,
        likelihood: e.likelihood,
        impact: e.impact,
        urgency: e.urgency,
        maturity: e.maturity,
        industries: JSON.stringify(e.industries),
        opportunities: JSON.stringify(e.opportunities),
        risks: JSON.stringify(e.risks),
        migrationPath: JSON.stringify(e.migrationPath),
        governanceShifts: JSON.stringify(e.governanceShifts),
        workforceShifts: JSON.stringify(e.workforceShifts),
        impacts: {
          create: e.impacts.map((imp) => ({
            capabilityId: imp.capabilityId,
            kind: imp.kind,
            note: imp.note,
          })),
        },
      },
    });
  }

  console.log(`  Logical components: ${logicalComponents.length}`);
  for (const lc of logicalComponents) {
    await prisma.logicalComponent.create({
      data: {
        id: lc.id,
        capabilityId: lc.capabilityId,
        name: lc.name,
        kind: lc.kind,
        description: lc.description ?? null,
      },
    });
  }

  console.log(`  Logical flows: ${logicalFlows.length}`);
  for (const lf of logicalFlows) {
    await prisma.logicalFlow.create({
      data: {
        fromId: lf.from,
        toId: lf.to,
        kind: lf.kind,
        label: lf.label ?? null,
      },
    });
  }

  console.log(`  Physical components: ${physicalComponents.length}`);
  for (const pc of physicalComponents) {
    await prisma.physicalComponent.create({
      data: {
        id: pc.id,
        capabilityId: pc.capabilityId,
        logicalComponentId: pc.logicalComponentId ?? null,
        name: pc.name,
        vendor: pc.vendor ?? null,
        kind: pc.kind,
        host: pc.host,
        description: pc.description ?? null,
      },
    });
  }

  console.log(`  Physical dependencies: ${physicalDependencies.length}`);
  for (const pd of physicalDependencies) {
    await prisma.physicalDependency.create({
      data: {
        fromId: pd.from,
        toId: pd.to,
        kind: pd.kind,
        label: pd.label ?? null,
      },
    });
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
