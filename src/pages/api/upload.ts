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

  console.log('raw cookie,', rawCookie);
  const userDetails = decodeCookie(rawCookie);

  if (!userDetails) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { email } = userDetails;

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

    // 1. Upload the file to Supabase storage
    const filePath = `${email}/${req.file.originalname}`;
    const { error: uploadError } = await supabase.storage
      .from('scriby')
      .upload(filePath, req.file.buffer);

    if (uploadError) {
      console.error(
        'Error uploading to Supabase:',
        uploadError.message
      );
      return res
        .status(500)
        .json({ error: 'Error uploading to Supabase' });
    }

    // 2. Continue with transcription as before
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

      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  });
};
