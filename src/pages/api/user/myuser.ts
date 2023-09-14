import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { ENCRYPTION_KEY } from '../../../../constants';
import decrypt from '../../../../lib/jwt/cryptography/decryption';
import { prisma } from '../../../../prisma/db';
export default async function handle(req: any, res: any) {
  if (req.method === 'GET') {
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

    const id = userDetails.userId;
    try {
      const userToReturn = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      return res.status(200).json(userToReturn);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    return res.status(405).end(); // Method not allowed
  }
}
