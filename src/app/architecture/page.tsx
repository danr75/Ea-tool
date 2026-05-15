import { getAllCapabilities } from "@/lib/db/capabilities";
import { getAllRelationships } from "@/lib/db/relationships";
import { getAllEmerging } from "@/lib/db/emerging";
import { getAllLogical } from "@/lib/db/logical";
import { getAllPhysical } from "@/lib/db/physical";
import { ArchitectureDataProvider } from "@/components/ArchitectureDataProvider";
import { ArchitectureClient } from "./ArchitectureClient";

export const dynamic = "force-dynamic";

export default async function ArchitecturePage() {
  const [capabilities, relationships, emerging, logical, physical] =
    await Promise.all([
      getAllCapabilities(),
      getAllRelationships(),
      getAllEmerging(),
      getAllLogical(),
      getAllPhysical(),
    ]);

  return (
    <ArchitectureDataProvider
      initial={{
        capabilities,
        relationships,
        emerging,
        logicalComponents: logical.components,
        logicalFlows: logical.flows,
        physicalComponents: physical.components,
        physicalDependencies: physical.dependencies,
      }}
    >
      <ArchitectureClient />
    </ArchitectureDataProvider>
  );
}
