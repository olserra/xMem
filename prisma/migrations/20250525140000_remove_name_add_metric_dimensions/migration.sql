/*
  Warnings:

  - You are about to drop the column `name` on the `MemorySource` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MemorySource" DROP COLUMN "name",
ADD COLUMN     "dimensions" INTEGER,
ADD COLUMN     "metric" TEXT;
