import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { prisma } from '../../../../prisma/db';
import { config } from 'dotenv';
import jwt from 'jsonwebtoken';
import encrypt from '../../../../lib/jwt/cryptography/encryption';
import { ENCRYPTION_KEY } from '../../../../constants';
config();

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method not allowed
  }

  const { email, password, googleId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        email,
      },
    });

    if (googleId) {
      // Google sign-up
      await prisma.authMethod.create({
        data: {
          userId: newUser.id,
          type: 'GOOGLE',
          uniqueId: googleId,
          verified: true, // Google users are assumed verified by default
        },
      });
    } else if (password) {
      // Email sign-up
      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.authMethod.create({
        data: {
          userId: newUser.id,
          type: 'EMAIL',
          password: hashedPassword,
        },
      });
    } else {
      // Neither password nor Google ID provided, cannot sign up
      return res.status(400).json({ error: 'Invalid signup method' });
    }

    // Create JWT payload
    const payload = {
      userId: newUser.id,
      email: newUser.email,
    };

    // Sign the payload into a JWT token
    const SECRET = process.env.JWT_SECRET; // Use a strong, unique secret stored in environment variables

    console.log('SECRET:', SECRET);
    if (!SECRET) {
      throw new Error('No JWT secret found');
    }
    const token = jwt.sign(payload, SECRET, { expiresIn: '60d' }); // The token will expire in 1 day. You can adjust this as needed.

    const encryptedToken = encrypt(
      token,
      Buffer.from(await ENCRYPTION_KEY)
    );
    res.setHeader(
      'Set-Cookie',
      `token=${encryptedToken}; Path=/; Secure; SameSite=Lax`
    );

    return res.status(200).json({ user: newUser });
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Something went wrong while signing up.' });
  }
}
