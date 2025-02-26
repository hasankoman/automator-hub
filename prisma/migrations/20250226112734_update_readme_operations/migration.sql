/*
  Warnings:

  - A unique constraint covering the columns `[userId,repositoryId]` on the table `ReadmeOperation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ReadmeOperation_userId_repositoryId_key" ON "ReadmeOperation"("userId", "repositoryId");
