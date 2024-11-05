/*
  Warnings:

  - The primary key for the `Skill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Skill` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `skillId` on the `Progress` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `skillId` on the `Quiz` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_UserSkills` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Progress" DROP CONSTRAINT "Progress_skillId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_skillId_fkey";

-- DropForeignKey
ALTER TABLE "_UserSkills" DROP CONSTRAINT "_UserSkills_A_fkey";

-- AlterTable
ALTER TABLE "Progress" DROP COLUMN "skillId",
ADD COLUMN     "skillId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "skillId",
ADD COLUMN     "skillId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Skill_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_UserSkills" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_skillId_key" ON "Progress"("userId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserSkills_AB_unique" ON "_UserSkills"("A", "B");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserSkills" ADD CONSTRAINT "_UserSkills_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
