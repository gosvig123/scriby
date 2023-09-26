import speech from '@google-cloud/speech';
import { parseBuffer, IAudioMetadata } from 'music-metadata';


export const parseAudioMetadata:  (audioBuffer: Buffer) => Promise<IAudioMetadata>  = async (audioBuffer: Buffer) => {
  return await parseBuffer(audioBuffer, {
    mimeType: 'audio/mpeg',
  });
};

export const initializeGoogleSpeechClient = () => {
  return new speech.SpeechClient({
    keyFilename: 'googleAgent.json',
  });
};

export const prepareGoogleSpeechRequest = (audioBuffer: Buffer) => {
  const audioBytes = audioBuffer.toString('base64');
  const config = {
    encoding: 'MP3',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    enableWordTimeOffsets: true,
    useEnhanced: true,
    model: 'video',
  };
  const audio = {
    content: audioBytes,
  };
  return {
    audio,
    config,
  };
};

export const transcribeAudio = async (
  googleAgent: any,
  request: any
) => {
  const [response]: any = await googleAgent.recognize(request);
  return response;
};

export const parseTranscription = (response: any) => {
  const wordPattern = /(\w+) \[(\d+\.\d+)-(\d+\.\d+)\]/g;
  let match;
  const parsedWords = [];
  const transcription = response.results
    .map((result: any) => {
      const wordInfo: any[] = result.alternatives[0].words;
      return wordInfo
        .map(
          (word) =>
            `${word.word} [${word.startTime.seconds}.${
              word.startTime.nanos / 1e6
            }-${word.endTime.seconds}.${word.endTime.nanos / 1e6}]`
        )
        .join(' ');
    })
    .join('\n');

  while ((match = wordPattern.exec(transcription)) !== null) {
    const [_, word, start_time, end_time] = match;
    parsedWords.push({
      word,
      start_time: parseFloat(start_time),
      end_time: parseFloat(end_time),
    });
  }

  return Buffer.from(
    JSON.stringify({ transcription: parsedWords }),
    'utf-8'
  );
};

export const transcribeAudioToBuffer = async (
  audioBuffer: Buffer
): Promise<Buffer> => {
  try {
    const googleAgent = initializeGoogleSpeechClient();
    const request = prepareGoogleSpeechRequest(audioBuffer);
    const response = await transcribeAudio(googleAgent, request);
    const transcriptionBuffer = parseTranscription(response);
    return transcriptionBuffer;
  } catch (error) {
    throw new Error('Error transcribing the audio');
  }
};
