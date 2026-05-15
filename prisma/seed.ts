import { PrismaClient } from "@prisma/client";
import { capabilities } from "../src/data/capabilities";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${capabilities.length} capabilities...`);
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
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
