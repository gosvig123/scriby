-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'google',
ALTER COLUMN "password" DROP NOT NULL;
