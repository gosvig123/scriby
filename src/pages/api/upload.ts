import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { ENCRYPTION_KEY, OPEN_AI_KEY, SUPERBASE_SECRET, START_SUPABASE } from '../../../constants';
import decrypt from '../../../lib/jwt/cryptography/decryption';
import speech from '@google-cloud/speech';
import fs from 'fs';
export const config = {
  api: {
    bodyParser: false,
  },
};

import { prisma } from '../../../prisma/db';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default async (req: any, res: any) => {
  const supabase = await START_SUPABASE;
  const cookies = parseCookies({ req });
  const encryptedToken = cookies.token;

  if (!encryptedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decryptedToken = decrypt(
    encryptedToken,
    Buffer.from(await ENCRYPTION_KEY)
  );

  const SECRET = process.env.JWT_SECRET;

  if (!SECRET) {
    throw new Error('No JWT secret found');
  }

  const userDetails = jwt.verify(decryptedToken, SECRET) as {
    email: string;
    userId: number;
  };

  console.log(userDetails);
  if (!userDetails) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { email } = userDetails;
  const id = userDetails.userId;
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  upload.single('file')(req, res, async (err) => {
    if (err) {
      console.error('Error with file upload:', err);
      return res
        .status(500)
        .json({ error: 'Error processing the file upload' });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const googleAgent = new speech.SpeechClient({
      keyFilename: 'googleAgent.json',
    });

    const audioBytes = req.file.buffer.toString('base64');
    const config = {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
      enableWordTimeOffsets: true,
      useEnhanced: true,
      model: 'video', // or 'phone_call', 'command_and_search' etc.
    };
    const audio = {
      content: audioBytes,
    };
    const request: any = {
      audio,
      config,
    };

    try {
      const [response]: any = await googleAgent.recognize(request);
      const transcription = response.results
        .map((result: any) => {
          const wordInfo: any[] = result.alternatives[0].words;
          const words: any = wordInfo
            .map(
              (word) =>
                `${word.word} [${word.startTime.seconds}.${
                  word.startTime.nanos / 1e6
                }-${word.endTime.seconds}.${
                  word.endTime.nanos / 1e6
                }]`
            )
            .join(' ');
          return words;
        })
        .join('\n');

      const wordPattern = /(\w+) \[(\d+\.\d+)-(\d+\.\d+)\]/g;
      let match;
      const parsedWords = [];

      while ((match = wordPattern.exec(transcription)) !== null) {
        const [_, word, start_time, end_time] = match;
        parsedWords.push({
          word,
          start_time: parseFloat(start_time),
          end_time: parseFloat(end_time),
        });
      }

      const transcriptionBuffer = Buffer.from(
        JSON.stringify({ transcription: parsedWords }),
        'utf-8'
      );

      // Define the path for the .json file in Supabase storage
      const filePath = `${email}/${
        req.file.originalname.split('.')[0]
      }.json`;

      // Upload the .json file to Supabase storage
      const { error: jsonUploadError } = await supabase.storage
        .from('scriby')
        .upload(filePath, transcriptionBuffer);

      if (jsonUploadError) {
        console.error(
          'Error uploading transcription to Supabase:',
          jsonUploadError.message
        );
        return res.status(500).json({
          error: 'Error uploading transcription to Supabase',
        });
      }

      const newTranscription = await prisma.transcription.create({
        data: {
          name: req.file.originalname,
          userId: id,
        },
      });

      // Send a successful response
      return res
        .status(200)
        .send({ text: transcription, metaData: newTranscription });
    } catch (error) {
      console.error('Error:', error);
      return res
        .status(500)
        .json({ error: 'Error transcribing the audio' });
    }
  });
};
