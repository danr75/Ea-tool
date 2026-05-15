-- CreateTable
CREATE TABLE "Relationship" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "strength" REAL NOT NULL,
    CONSTRAINT "Relationship_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Capability" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Relationship_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Capability" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EmergingCapability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "horizon" TEXT NOT NULL,
    "likelihood" REAL NOT NULL,
    "impact" REAL NOT NULL,
    "urgency" REAL NOT NULL,
    "maturity" TEXT NOT NULL,
    "industries" TEXT NOT NULL,
    "opportunities" TEXT NOT NULL,
    "risks" TEXT NOT NULL,
    "migrationPath" TEXT NOT NULL,
    "governanceShifts" TEXT NOT NULL,
    "workforceShifts" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmergingImpact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "signalId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    CONSTRAINT "EmergingImpact_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "EmergingCapability" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "EmergingImpact_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogicalComponent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "capabilityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "LogicalComponent_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LogicalFlow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT,
    CONSTRAINT "LogicalFlow_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "LogicalComponent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LogicalFlow_toId_fkey" FOREIGN KEY ("toId") REFERENCES "LogicalComponent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PhysicalComponent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "capabilityId" TEXT NOT NULL,
    "logicalComponentId" TEXT,
    "name" TEXT NOT NULL,
    "vendor" TEXT,
    "kind" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "PhysicalComponent_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PhysicalComponent_logicalComponentId_fkey" FOREIGN KEY ("logicalComponentId") REFERENCES "LogicalComponent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PhysicalDependency" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "label" TEXT,
    CONSTRAINT "PhysicalDependency_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "PhysicalComponent" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PhysicalDependency_toId_fkey" FOREIGN KEY ("toId") REFERENCES "PhysicalComponent" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Relationship_fromId_toId_kind_key" ON "Relationship"("fromId", "toId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "EmergingImpact_signalId_capabilityId_key" ON "EmergingImpact"("signalId", "capabilityId");

-- CreateIndex
CREATE UNIQUE INDEX "LogicalFlow_fromId_toId_kind_key" ON "LogicalFlow"("fromId", "toId", "kind");

-- CreateIndex
CREATE UNIQUE INDEX "PhysicalDependency_fromId_toId_kind_key" ON "PhysicalDependency"("fromId", "toId", "kind");
