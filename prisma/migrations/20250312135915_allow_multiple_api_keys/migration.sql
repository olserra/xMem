-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_userId_fkey";

-- DropIndex
DROP INDEX "ApiKey_userId_key";

-- AlterTable
ALTER TABLE "ApiKey" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastUsed" TIMESTAMP(3),
ADD COLUMN     "name" TEXT;

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "ApiKey"("userId");

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
