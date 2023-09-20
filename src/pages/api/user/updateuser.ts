import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../prisma/db';
import { parseCookies } from 'nookies';
import { ENCRYPTION_KEY, JWT_SECRET } from '../../../../constants';
import decrypt from '../../../../lib/jwt/cryptography/decryption';
import jwt from 'jsonwebtoken';
interface UserRequestBody {
  id: number;
  credits: number;
}

type UserRequest = NextApiRequest & {
  body: UserRequestBody;
};

interface UserUpdateData {
  credits?: number;
}

export default async function handler(
  req: UserRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).end();
  }
  const cookies = parseCookies({ req });
  const encryptedToken = cookies.token;

  console.log(encryptedToken);

  if (!encryptedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decryptedToken = decrypt(
    encryptedToken,
    Buffer.from(await ENCRYPTION_KEY)
  );

  console.log(decryptedToken);
  const SECRET = await JWT_SECRET;

  if (!SECRET) {
    throw new Error('No JWT secret found');
  }

  const userDetails = jwt.verify(decryptedToken, SECRET) as {
    email: string;
    userId: number;
  };
  console.log(userDetails);
  const id = userDetails.userId;

  if (!id) {
    return res.status(400).json({ error: 'No id provided' });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  console.log(user);
  const creditsToAdd =
    JSON.parse(req.body).credits || req.body.credits;
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const credits = user.credits + creditsToAdd;
  if (typeof id === 'number' && !id) {
    return res.status(400).json({ error: 'No id provided' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        credits: credits,
      } as UserUpdateData,
    });
    res.status(200).json({ updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while updating the user.' });
  }
}
