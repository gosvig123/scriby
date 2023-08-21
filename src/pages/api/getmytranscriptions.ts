import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
import { decodeCookie } from '../../../lib/jwt/decodeToken';
export default async function handle(req: any, res: any) {
  if (req.method === 'GET') {
    const rawCookie = req.headers.cookie;
    console.log(rawCookie);
    const userDetails = decodeCookie(rawCookie);

    console.log(userDetails);
    if (!userDetails || !userDetails.id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    try {
      const transcriptions = await prisma.transcription.findMany({
        where: {
          userId: userDetails.id,
        },
        select: {
          name: true,
          createdAt: true,
        },
      });

      return res.status(200).json(transcriptions);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).end(); // Method not allowed
  }
}
