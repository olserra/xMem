/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `ApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Memory" ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "sentiment" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "sourceId" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceConfig" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "webhookUrl" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSync" TIMESTAMP(3),
    "syncInterval" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SourceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemoryToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemoryToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MemoryRelations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MemoryRelations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_name_key" ON "Subject"("name");

-- CreateIndex
CREATE INDEX "SourceConfig_userId_idx" ON "SourceConfig"("userId");

-- CreateIndex
CREATE INDEX "SourceConfig_source_idx" ON "SourceConfig"("source");

-- CreateIndex
CREATE UNIQUE INDEX "SourceConfig_userId_source_key" ON "SourceConfig"("userId", "source");

-- CreateIndex
CREATE INDEX "_MemoryToSubject_B_index" ON "_MemoryToSubject"("B");

-- CreateIndex
CREATE INDEX "_MemoryRelations_B_index" ON "_MemoryRelations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_userId_key" ON "ApiKey"("userId");

-- CreateIndex
CREATE INDEX "Memory_source_idx" ON "Memory"("source");

-- CreateIndex
CREATE INDEX "Memory_sourceId_idx" ON "Memory"("sourceId");

-- CreateIndex
CREATE INDEX "Memory_language_idx" ON "Memory"("language");

-- AddForeignKey
ALTER TABLE "_MemoryToSubject" ADD CONSTRAINT "_MemoryToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemoryToSubject" ADD CONSTRAINT "_MemoryToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemoryRelations" ADD CONSTRAINT "_MemoryRelations_A_fkey" FOREIGN KEY ("A") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemoryRelations" ADD CONSTRAINT "_MemoryRelations_B_fkey" FOREIGN KEY ("B") REFERENCES "Memory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
