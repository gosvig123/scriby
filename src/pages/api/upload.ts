import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { decodeCookie } from '../../../lib/jwt/decodeToken';
export const config = {
  api: {
    bodyParser: false,
  },
};

import { prisma } from '../../../prisma/db';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const supabaseUrl = 'https://wosbhxghmxqqwsrejrnl.supabase.co'; // replace with your Supabase project URL
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc2JoeGdobXhxcXdzcmVqcm5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NzExNDc2MCwiZXhwIjoyMDAyNjkwNzYwfQ.zBVHoCGc-lgX4iNRLOYMduCrKQBXWcocVay578eFW-E'; // replace with your Supabase service role key
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

export default async (req: any, res: any) => {
  const rawCookie = req.headers.cookie;
  const userDetails = decodeCookie(rawCookie);

  if (!userDetails) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { email, id } = userDetails;
  console.log(email, id);
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

    // Transcription process
    const key = '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';
    const model = 'whisper-1';
    const formData = new FormData();
    formData.append('model', model);
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
    });

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${key}`,
            ...formData.getHeaders(),
          },
        }
      );

      // Check if the response contains 'text'
      const transcription = response.data.text;
      if (!transcription) {
        console.error(
          'No transcription found in the response:',
          response.data
        );
        return res
          .status(500)
          .json({ error: 'No transcription received' });
      }

      // Convert the transcribed text to a Buffer
      const transcriptionBuffer = Buffer.from(transcription, 'utf-8');

      // Define the path for the .txt file in Supabase storage
      const txtFilePath = `${email}/${req.file.originalname}.txt`;

      // Upload the .txt file to Supabase storage
      const { error: txtUploadError } = await supabase.storage
        .from('scriby')
        .upload(txtFilePath, transcriptionBuffer);

      if (txtUploadError) {
        console.error(
          'Error uploading transcription to Supabase:',
          txtUploadError.message
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
      res.status(200).json(newTranscription);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Error transcribing the audio' });
    }
  });
};
