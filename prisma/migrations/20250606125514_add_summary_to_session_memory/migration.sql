/*
  Warnings:

  - The primary key for the `SessionMemory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `SessionMemory` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `SessionMemory` table. All the data in the column will be lost.
  - You are about to drop the column `memory` on the `SessionMemory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SessionMemory" DROP CONSTRAINT "SessionMemory_userId_fkey";

-- DropIndex
DROP INDEX "SessionMemory_userId_sessionId_key";

-- AlterTable
ALTER TABLE "SessionMemory" DROP CONSTRAINT "SessionMemory_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "memory",
ADD COLUMN     "summary" TEXT,
ADD CONSTRAINT "SessionMemory_pkey" PRIMARY KEY ("sessionId");

-- CreateTable
CREATE TABLE "SessionMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "embedding" DOUBLE PRECISION[],
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContextInjectionLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "injectedMsgIds" TEXT NOT NULL,
    "injectedSummary" TEXT,
    "injectedVectorIds" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContextInjectionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SessionMessage" ADD CONSTRAINT "SessionMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "SessionMemory"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionMemory" ADD CONSTRAINT "SessionMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
