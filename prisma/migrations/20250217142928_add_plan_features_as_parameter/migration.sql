/*
  Warnings:

  - You are about to drop the column `maxRepos` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `readmeUpdateLimit` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "maxRepos",
DROP COLUMN "readmeUpdateLimit",
ADD COLUMN     "allowBranchSelection" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manualReadmeUpdateLimit" INTEGER NOT NULL DEFAULT 10;
