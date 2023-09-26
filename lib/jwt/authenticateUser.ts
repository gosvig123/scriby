import { parseCookies } from 'nookies';
import decrypt from './cryptography/decryption';
import { ENCRYPTION_KEY } from '../../constants';
import jwt from 'jsonwebtoken';
export const authenticateUser = async (req: any) => {
  const cookies = parseCookies({ req });
  const encryptedToken = cookies.token;
  if (!encryptedToken) {
    throw new Error('Unauthorized');
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
    throw new Error('Unauthorized');
  }

  return userDetails;
};

export default authenticateUser