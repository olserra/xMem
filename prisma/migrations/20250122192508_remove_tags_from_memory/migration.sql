/*
  Warnings:

  - You are about to drop the column `tags` on the `Memory` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Memory_tags_idx";

-- AlterTable
ALTER TABLE "Memory" DROP COLUMN "tags";
