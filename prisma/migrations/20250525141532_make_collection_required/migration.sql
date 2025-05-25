/*
  Warnings:

  - Made the column `collection` on table `MemorySource` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MemorySource" ALTER COLUMN "collection" SET NOT NULL;
