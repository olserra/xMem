/*
  Warnings:

  - You are about to drop the column `groupId` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the `GroupProgress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkillGroup` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,skillId]` on the table `Progress` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GroupProgress" DROP CONSTRAINT "GroupProgress_groupId_fkey";

-- DropForeignKey
ALTER TABLE "GroupProgress" DROP CONSTRAINT "GroupProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_groupId_fkey";

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "groupId",
DROP COLUMN "type";

-- DropTable
DROP TABLE "GroupProgress";

-- DropTable
DROP TABLE "SkillGroup";

-- DropEnum
DROP TYPE "SkillType";

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_skillId_key" ON "Progress"("userId", "skillId");
