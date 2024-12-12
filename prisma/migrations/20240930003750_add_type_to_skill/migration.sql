/*
  Warnings:

  - Added the required column `type` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SkillType" AS ENUM ('HARD', 'SOFT');

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "type" "SkillType" NOT NULL;
