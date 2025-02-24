-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "autoReadmeUpdateLimit" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Usage" ADD COLUMN     "autoReadmeUsed" INTEGER NOT NULL DEFAULT 0;
