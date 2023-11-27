-- AlterTable
ALTER TABLE "Transcription" ALTER COLUMN "confidence" SET DEFAULT 0,
ALTER COLUMN "paragraphs" SET DEFAULT '{}',
ALTER COLUMN "words" SET DEFAULT '[]';
