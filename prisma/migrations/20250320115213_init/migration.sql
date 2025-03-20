/*
  Warnings:

  - You are about to drop the `Memory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MemoryRelations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MemoryToSubject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_userId_fkey";

-- DropForeignKey
ALTER TABLE "_MemoryRelations" DROP CONSTRAINT "_MemoryRelations_A_fkey";

-- DropForeignKey
ALTER TABLE "_MemoryRelations" DROP CONSTRAINT "_MemoryRelations_B_fkey";

-- DropForeignKey
ALTER TABLE "_MemoryToSubject" DROP CONSTRAINT "_MemoryToSubject_A_fkey";

-- DropForeignKey
ALTER TABLE "_MemoryToSubject" DROP CONSTRAINT "_MemoryToSubject_B_fkey";

-- DropTable
DROP TABLE "Memory";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "_MemoryRelations";

-- DropTable
DROP TABLE "_MemoryToSubject";

-- CreateTable
CREATE TABLE "Data" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "embedding" DOUBLE PRECISION[],
    "metadata" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DataToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DataToSubject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Data_type_idx" ON "Data"("type");

-- CreateIndex
CREATE INDEX "Data_userId_idx" ON "Data"("userId");

-- CreateIndex
CREATE INDEX "Data_projectId_idx" ON "Data"("projectId");

-- CreateIndex
CREATE INDEX "_DataToSubject_B_index" ON "_DataToSubject"("B");

-- AddForeignKey
ALTER TABLE "Data" ADD CONSTRAINT "Data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataToSubject" ADD CONSTRAINT "_DataToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DataToSubject" ADD CONSTRAINT "_DataToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
