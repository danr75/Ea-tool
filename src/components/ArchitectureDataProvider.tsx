"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Capability,
  EmergingCapability,
  LogicalComponent,
  LogicalFlow,
  PhysicalComponent,
  PhysicalDependency,
  Relationship,
} from "@/lib/types";

export interface ArchitectureData {
  capabilities: Capability[];
  capabilitiesById: Record<string, Capability>;
  relationships: Relationship[];
  emerging: EmergingCapability[];
  emergingById: Record<string, EmergingCapability>;
  emergingByCapability: Record<string, EmergingCapability[]>;
  logicalComponents: LogicalComponent[];
  logicalFlows: LogicalFlow[];
  physicalComponents: PhysicalComponent[];
  physicalDependencies: PhysicalDependency[];
  capabilitiesWithLogical: string[];
  capabilitiesWithPhysical: string[];

  // Mutators (optimistic local updates after server actions succeed)
  upsertCapability: (c: Capability) => void;
  removeCapability: (id: string) => void;
  addRelationship: (r: Relationship) => void;
  removeRelationship: (from: string, to: string, kind: string) => void;
}

const ArchitectureDataContext = createContext<ArchitectureData | null>(null);

export interface ArchitectureDataInput {
  capabilities: Capability[];
  relationships: Relationship[];
  emerging: EmergingCapability[];
  logicalComponents: LogicalComponent[];
  logicalFlows: LogicalFlow[];
  physicalComponents: PhysicalComponent[];
  physicalDependencies: PhysicalDependency[];
}

export function ArchitectureDataProvider({
  initial,
  children,
}: {
  initial: ArchitectureDataInput;
  children: ReactNode;
}) {
  const [capabilities, setCapabilities] = useState(initial.capabilities);
  const [relationships, setRelationships] = useState(initial.relationships);
  const [emerging] = useState(initial.emerging);
  const [logicalComponents] = useState(initial.logicalComponents);
  const [logicalFlows] = useState(initial.logicalFlows);
  const [physicalComponents] = useState(initial.physicalComponents);
  const [physicalDependencies] = useState(initial.physicalDependencies);

  const upsertCapability = useCallback((c: Capability) => {
    setCapabilities((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id);
      if (idx < 0) return [...prev, c];
      const next = prev.slice();
      next[idx] = c;
      return next;
    });
  }, []);

  const removeCapability = useCallback((id: string) => {
    setCapabilities((prev) => prev.filter((c) => c.id !== id));
    setRelationships((prev) =>
      prev.filter((r) => r.from !== id && r.to !== id),
    );
  }, []);

  const addRelationship = useCallback((r: Relationship) => {
    setRelationships((prev) => [...prev, r]);
  }, []);

  const removeRelationship = useCallback(
    (from: string, to: string, kind: string) => {
      setRelationships((prev) =>
        prev.filter(
          (r) => !(r.from === from && r.to === to && r.kind === kind),
        ),
      );
    },
    [],
  );

  const value = useMemo<ArchitectureData>(() => {
    const capabilitiesById = Object.fromEntries(
      capabilities.map((c) => [c.id, c]),
    );
    const emergingById = Object.fromEntries(emerging.map((e) => [e.id, e]));
    const emergingByCapability: Record<string, EmergingCapability[]> = {};
    for (const e of emerging) {
      for (const imp of e.impacts) {
        (emergingByCapability[imp.capabilityId] ??= []).push(e);
      }
    }
    const capabilitiesWithLogical = Array.from(
      new Set(logicalComponents.map((c) => c.capabilityId)),
    );
    const capabilitiesWithPhysical = Array.from(
      new Set(physicalComponents.map((c) => c.capabilityId)),
    );
    return {
      capabilities,
      capabilitiesById,
      relationships,
      emerging,
      emergingById,
      emergingByCapability,
      logicalComponents,
      logicalFlows,
      physicalComponents,
      physicalDependencies,
      capabilitiesWithLogical,
      capabilitiesWithPhysical,
      upsertCapability,
      removeCapability,
      addRelationship,
      removeRelationship,
    };
  }, [
    capabilities,
    relationships,
    emerging,
    logicalComponents,
    logicalFlows,
    physicalComponents,
    physicalDependencies,
    upsertCapability,
    removeCapability,
    addRelationship,
    removeRelationship,
  ]);

  return (
    <ArchitectureDataContext.Provider value={value}>
      {children}
    </ArchitectureDataContext.Provider>
  );
}

export function useArchitectureData(): ArchitectureData {
  const ctx = useContext(ArchitectureDataContext);
  if (!ctx) {
    throw new Error(
      "useArchitectureData must be used inside ArchitectureDataProvider",
    );
  }
  return ctx;
}
