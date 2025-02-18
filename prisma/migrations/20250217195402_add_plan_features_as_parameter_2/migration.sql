/*
  Warnings:

  - You are about to drop the column `readmeUpdates` on the `Usage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Usage" DROP COLUMN "readmeUpdates",
ADD COLUMN     "manualUpdatesUsed" INTEGER NOT NULL DEFAULT 0;
