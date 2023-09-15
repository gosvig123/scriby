import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { ENCRYPTION_KEY, OPEN_AI_KEY, SUPERBASE_SECRET, START_SUPABASE } from '../../../constants';
import decrypt from '../../../lib/jwt/cryptography/decryption';
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

    // Transcription process
    const key = await OPEN_AI_KEY;
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
      const transcriptionBuffer = Buffer.from(
        JSON.stringify({ transcription: transcription }),
        'utf-8'
      );

      // Define the path for the .txt file in Supabase storage
      const filePath = `${email}/${
        req.file.originalname.split('.')[0]
      }.json`;

      // Upload the .txt file to Supabase storage
      const { error: txtUploadError } = await supabase.storage
        .from('scriby')
        .upload(filePath, transcriptionBuffer);

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
      return res.status(200).json(newTranscription);
    } catch (error) {
      console.error('Error:', error);
      return res
        .status(500)
        .json({ error: 'Error transcribing the audio' });
    }
  });
};
