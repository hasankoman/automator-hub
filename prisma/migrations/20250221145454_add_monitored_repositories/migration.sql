-- CreateTable
CREATE TABLE "MonitoredRepository" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "webhookId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MonitoredRepository_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MonitoredRepository_fullName_idx" ON "MonitoredRepository"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "MonitoredRepository_userId_repositoryId_key" ON "MonitoredRepository"("userId", "repositoryId");

-- AddForeignKey
ALTER TABLE "MonitoredRepository" ADD CONSTRAINT "MonitoredRepository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
