-- CreateTable
CREATE TABLE "ReadmeOperation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "repositoryName" TEXT NOT NULL,
    "operationType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadmeOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReadmeOperation_userId_idx" ON "ReadmeOperation"("userId");

-- CreateIndex
CREATE INDEX "ReadmeOperation_repositoryId_idx" ON "ReadmeOperation"("repositoryId");

-- AddForeignKey
ALTER TABLE "ReadmeOperation" ADD CONSTRAINT "ReadmeOperation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
