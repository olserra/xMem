-- CreateTable
CREATE TABLE "MemorySource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "itemCount" INTEGER,
    "lastSync" TIMESTAMP(3),
    "vectorDbUrl" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "embeddingModel" TEXT NOT NULL,
    "maxCacheSize" INTEGER NOT NULL,
    "sessionTtl" INTEGER NOT NULL,
    "enableCache" BOOLEAN NOT NULL,
    "collection" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemorySource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemorySource" ADD CONSTRAINT "MemorySource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
