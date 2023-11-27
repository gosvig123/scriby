// pages/api/transcribe.ts
import multer from "multer";
import { Deepgram } from "@deepgram/sdk";
import { DEEPGRAM_API_KEY } from "../../../constants";
import { authenticateUser } from "../../../lib/jwt/authenticateUser";
import { prisma } from "../../../prisma/db";

// Multer setup (for in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};

// Promisify multer middleware
const multerSingle = (fieldName: string) => {
  return (req: any, res: any) => {
    return new Promise((resolve, reject) => {
      upload.single(fieldName)(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else if (req.file) {
          resolve(req.file);
        } else {
          reject(new Error("No file uploaded"));
        }
      });
    });
  };
};

export default async function handler(req: any, res: any) {
  try {
    // Authenticate user
    const userDetails = await authenticateUser(req);
    const userId: any = userDetails.userId;

    // Check for POST request
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    // Process file upload
    await multerSingle("file")(req, res);

    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Setup Deepgram
    const deepgram = new Deepgram(await DEEPGRAM_API_KEY);
    const audio = req.file.buffer;
    const name = req.file.originalname;
    const source = { buffer: audio, mimetype: req.file.mimetype };

    // Transcription with Deepgram
    const response: any = await deepgram.transcription.preRecorded(source, {
      smart_format: true,
      model: "nova",
    });

    const transcriptionData = response.results?.channels[0].alternatives[0];

    console.log("Transcription: 0", transcriptionData);
    const fileTranscript =
      transcriptionData.transcript || transcriptionData.Transcript;

    const Fileconfidence = parseFloat(transcriptionData.confidence);
    console.log("Transcript with conficence:", Fileconfidence);

    const Filewords = transcriptionData.words;
    const fileParagraps = transcriptionData.paragraphs;

    // Creating new transcription in database
    const newTranscription = await prisma.transcription.create({
      data: {
        name,
        user: {
          connect: {
            id: userId, // Replace 'id' with the actual unique identifier field for User
          },
        },
        confidence: Fileconfidence,
        words: Filewords,
        paragraphs: fileParagraps,
        transcript: fileTranscript,
      },
    });

    console.log(newTranscription);
    res.status(200).json(newTranscription);
  } catch (error) {
    console.error("Transcription Error:", error);
    res.status(500).json({ error: "Error transcribing the audio" });
  }
}
