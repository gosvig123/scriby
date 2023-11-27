// pages/api/transcribe.ts
import multer from "multer";
import { Deepgram } from "@deepgram/sdk";
import { DEEPGRAM_API_KEY } from "../../../constants";

// Multer setup (for in-memory storage, can be adjusted as needed)
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false,
  },
};
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  upload.single("file")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Error uploading the file" });
    }

    const deepgram = new Deepgram(await DEEPGRAM_API_KEY);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const audio = req.file.buffer;
      const source = { buffer: audio, mimetype: req.file.mimetype };
      const response = await deepgram.transcription.preRecorded(source, {
        smart_format: true,
        model: "nova",
      });

      console.log(response.results?.channels[0].alternatives[0]);

      res.status(200).json(response);
    } catch (error) {
      console.error("Transcription Error:", error);
      res.status(500).json({ error: "Error transcribing the audio" });
    }
  });
}
