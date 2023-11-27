/*
  Warnings:

  - Added the required column `confidence` to the `Transcription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paragraphs` to the `Transcription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcript` to the `Transcription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `words` to the `Transcription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transcription" ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paragraphs" JSONB NOT NULL,
ADD COLUMN     "transcript" TEXT NOT NULL,
ADD COLUMN     "words" JSONB NOT NULL;
