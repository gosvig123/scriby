import handleFileUpload from '../../../lib/jwt/multerStorage';
import { IAudioMetadata } from 'music-metadata';
import { parseAudioMetadata } from '../../../lib/handleFileTranscription';
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
import { OPEN_AI_KEY } from '../../../constants';
import FormData from 'form-data';
import axios from 'axios';

export default async (req: any, res: any) => {
  const userDetails = await authenticateUser(req);

  const { email } = userDetails;
  const id = userDetails.userId;
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    await handleFileUpload(req, res);
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const originalName = req.file.originalname;
    const metadata: IAudioMetadata = await parseAudioMetadata(
      req.file.buffer
    );
    // const transcriptionBuffer = await transcribeAudioToBuffer(
    //   req.file.buffer
    // );
    const key = await OPEN_AI_KEY;
    console.log('key', key);
    const model = 'whisper-1';
    const form = new FormData();
    form.append('model', model);
    form.append('file', req.file.buffer, {
      filename: req.file.originalname,
    });
    console.log('buffer', req.file.buffer);
    const response: any = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        headers: {
          Authorization: `Bearer ${key}`,
          ...form.getHeaders(),
        },
      }
    );

    const transcription = response.data;
    if (!transcription) {
      console.error(
        'No transcription found in the response:',
        response
      );
      return res
        .status(500)
        .json({ error: 'No transcription received' });
    }
    console.log('transcription', transcription);

    // Convert the transcribed text to a Buffer
    const transcriptionBuffer = Buffer.from(
      JSON.stringify({ transcription: transcription }),
      'utf-8'
    );

    await uploadToSupabase(email, originalName, transcriptionBuffer);

    await createTranscriptionRecord(originalName, id, metadata);

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


    // // Transcription process
    // const key = await OPEN_AI_KEY;
    // const model = 'whisper-1';
    // const formData = new FormData();
    // formData.append('model', model);
    // formData.append('file', req.file.buffer, {
    //   filename: req.file.originalname,
    // });

    // try {
    //   const response = await axios.post(
    //     'https://api.openai.com/v1/audio/transcriptions',
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${key}`,
    //         ...formData.getHeaders(),
    //       },
    //     }
    //   );

    //   // Check if the response contains 'text'
    //   const transcription = response.data.text;
    //   if (!transcription) {
    //     console.error(
    //       'No transcription found in the response:',
    //       response.data
    //     );
    //     return res
    //       .status(500)
    //       .json({ error: 'No transcription received' });
    //   }

    //   // Convert the transcribed text to a Buffer
    //   const transcriptionBuffer = Buffer.from(
    //     JSON.stringify({ transcription: transcription }),
    //     'utf-8'
    //   );

    //   // Define the path for the .txt file in Supabase storage
    //   const filePath = `${email}/${
    //     req.file.originalname.split('.')[0]
    //   }.json`;