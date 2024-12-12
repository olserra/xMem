/*
  Warnings:

  - You are about to drop the column `type` on the `Skill` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Progress_userId_skillId_key";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "type",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "labels" TEXT[];

-- DropEnum
DROP TYPE "SkillType";
