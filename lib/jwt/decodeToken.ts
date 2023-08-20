import jwt from 'jsonwebtoken';

interface DecodedPayload {
  userId: number; // <-- Change this from 'id' to 'userId'
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expires at
}

export function decodeCookie(
  rawCookie: string | undefined
): { id: number; email: string } | null {
  if (!rawCookie) {
    return null;
  }

  const tokenName = 'token=';
  const start = rawCookie.indexOf(tokenName);

  if (start === -1) {
    return null;
  }

  const end = rawCookie.indexOf(';', start);
  const token = rawCookie.substring(
    start + tokenName.length,
    end !== -1 ? end : undefined
  );

  try {
    const SECRET = process.env.JWT_SECRET;

    if (!SECRET) {
      throw new Error('No JWT secret found');
    }

    const decoded = jwt.verify(token, SECRET) as DecodedPayload;

    return {
      id: decoded.userId,
      email: decoded.email,
    };
  } catch (err) {
    console.error('Error decoding token from cookie:', err);
    return null;
  }
}
