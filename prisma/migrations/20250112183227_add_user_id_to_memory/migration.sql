/*
  Warnings:

  - You are about to drop the column `data` on the `Memory` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Memory` table. All the data in the column will be lost.
  - Added the required column `content` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Memory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Memory" DROP CONSTRAINT "Memory_user_id_fkey";

-- DropIndex
DROP INDEX "Memory_user_id_idx";

-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "data",
DROP COLUMN "user_id",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "Project"("userId");

-- CreateIndex
CREATE INDEX "Project_type_idx" ON "Project"("type");

-- CreateIndex
CREATE INDEX "Project_visibility_idx" ON "Project"("visibility");

-- CreateIndex
CREATE INDEX "Memory_projectId_idx" ON "Memory"("projectId");

-- CreateIndex
CREATE INDEX "Memory_type_idx" ON "Memory"("type");

-- CreateIndex
CREATE INDEX "Memory_tags_idx" ON "Memory"("tags");

-- CreateIndex
CREATE INDEX "Memory_userId_idx" ON "Memory"("userId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memory" ADD CONSTRAINT "Memory_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
