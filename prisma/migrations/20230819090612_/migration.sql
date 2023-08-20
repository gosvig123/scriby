/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('GOOGLE', 'EMAIL', 'OTHER');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
DROP COLUMN "provider",
DROP COLUMN "verified";

-- CreateTable
CREATE TABLE "AuthMethod" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "auth_type" "AuthType" NOT NULL,
    "password" TEXT,
    "uniqueId" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthMethod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthMethod_id_key" ON "AuthMethod"("id");

-- AddForeignKey
ALTER TABLE "AuthMethod" ADD CONSTRAINT "AuthMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
