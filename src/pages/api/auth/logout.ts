import { NextApiRequest, NextApiResponse } from 'next';

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).end();
  }

  // Clear the token cookie
  res.setHeader(
    'Set-Cookie',
    `token=; Path=/; Secure; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );

  return res.status(200).json({ message: 'Logged out successfully' });
}
