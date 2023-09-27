import { prisma } from '../prisma/db';
import { START_SUPABASE } from '../constants';
import { IAudioMetadata } from 'music-metadata';
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
}

export const createTranscriptionRecord = async (
  originalFileName: string,
  userId: number,
  metaData: IAudioMetadata
) => {
  await prisma.transcription.create({
    data: {
      name: originalFileName,
      userId,
    },
  });

  let duration: number | undefined = metaData.format.duration;
  if (duration) {
    duration = Math.ceil(duration / 60);
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      credits: {
        increment: duration,
      },
    },
  });
};


