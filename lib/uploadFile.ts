import { prisma } from '../prisma/db';
import { START_SUPABASE } from '../constants';
// supabaseOperations.ts
export const uploadToSupabase = async (
  email: string,
  originalFileName: string,
  buffer: Buffer
) => {
  const supabase = await START_SUPABASE;

  const filePath = `${email}/${originalFileName.split('.')[0]}.json`;
  const { error } = await supabase.storage
    .from('scriby')
    .upload(filePath, buffer);
  if (error) {
    throw new Error(
      `Error uploading transcription to Supabase: ${error.message}`
    );
  }

  return filePath;
};

// databaseOperations.ts
export const createTranscriptionRecord = async (
  originalFileName: string,
  userId: number
) => {
  return await prisma.transcription.create({
    data: {
      name: originalFileName,
      userId,
    },
  });
};
