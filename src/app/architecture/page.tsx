import { getAllCapabilities } from "@/lib/db/capabilities";
import { ArchitectureClient } from "./ArchitectureClient";

export const dynamic = "force-dynamic";

export default async function ArchitecturePage() {
  const capabilities = await getAllCapabilities();
  return <ArchitectureClient initialCapabilities={capabilities} />;
}
