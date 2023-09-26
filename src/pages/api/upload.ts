import handleFileUpload from '../../../lib/jwt/multerStorage';
import { IAudioMetadata } from 'music-metadata';

import {
  transcribeAudioToBuffer,
  parseAudioMetadata,
} from '../../../lib/handleFileTranscription';
import authenticateUser from '../../../lib/jwt/authenticateUser';
export const config = {
  api: {
    bodyParser: false,
  },
};

import {
  createTranscriptionRecord,
  uploadToSupabase,
} from '../../../lib/uploadFile';

export default async (req: any, res: any) => {
  const userDetails = await authenticateUser(req);

  const { email } = userDetails;
  const id = userDetails.userId;
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    await handleFileUpload(req, res);
    const metadata: IAudioMetadata = await parseAudioMetadata(
      req.file.buffer
    );
    const transcriptionBuffer = await transcribeAudioToBuffer(
      req.file.buffer
    );

    const originalName = req.file.originalname;
    await uploadToSupabase(email, originalName, transcriptionBuffer);

    await createTranscriptionRecord(originalName, id);

    // Send a successful response
    return res.status(200).send({
      transcription: transcriptionBuffer,
    });
  } catch (error) {
    console.error('Error:', error);
    return res
      .status(500)
      .json({ error: 'Error transcribing the audio' });
  }
};
