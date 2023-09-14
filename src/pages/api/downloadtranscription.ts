import { createClient } from '@supabase/supabase-js';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import decrypt from '../../../lib/jwt/cryptography/decryption';
import { ENCRYPTION_KEY } from '../../../constants';
const supabaseUrl = 'https://wosbhxghmxqqwsrejrnl.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc2JoeGdobXhxcXdzcmVqcm5sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NzExNDc2MCwiZXhwIjoyMDAyNjkwNzYwfQ.zBVHoCGc-lgX4iNRLOYMduCrKQBXWcocVay578eFW-E'; //
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

export default async (req: any, res: any) => {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }
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

  if (!userDetails) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { email } = userDetails;
  const fileName = req.query.fileName;

  const filePath = `${email}/${fileName}`;
  const lastPeriodIndex = filePath.lastIndexOf('.');

  const filePathWithoutExtension = `${filePath.substring(
    0,
    lastPeriodIndex
  )}.json`;

  console.log(filePathWithoutExtension);

  const { data, error } = await supabase.storage
    .from('scriby')
    .download(filePathWithoutExtension);

  const arrayBuffer = await data?.arrayBuffer(); // Resolving the promise to get the ArrayBuffer

  if (!arrayBuffer) {
    return res.status(500).json({ error: 'Error downloading file' });
  }

  const uint8Array = new Uint8Array(arrayBuffer);
  let text: any = new TextDecoder('utf-8').decode(uint8Array);
  text = JSON.parse(text);
  if (error) {
    console.error('Error downloading file:', error);
    return res.status(500).json({ error: 'Error downloading file' });
  }

  res.status(200).send({ text: text.transcription });
};
