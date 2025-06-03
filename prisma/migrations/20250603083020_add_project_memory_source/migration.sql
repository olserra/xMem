-- CreateTable
CREATE TABLE "ProjectMemorySource" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "memorySourceId" TEXT NOT NULL,

    CONSTRAINT "ProjectMemorySource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMemorySource_projectId_memorySourceId_key" ON "ProjectMemorySource"("projectId", "memorySourceId");

-- AddForeignKey
ALTER TABLE "ProjectMemorySource" ADD CONSTRAINT "ProjectMemorySource_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMemorySource" ADD CONSTRAINT "ProjectMemorySource_memorySourceId_fkey" FOREIGN KEY ("memorySourceId") REFERENCES "MemorySource"("id") ON DELETE CASCADE ON UPDATE CASCADE;
