// pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../../../prisma/db";
import { ENCRYPTION_KEY, JWT_SECRET } from "../../../../constants";
import encrypt from "../../../../lib/jwt/cryptography/encryption";
export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<any> {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method not allowed
  }

  const { email, password, googleId } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (googleId) {
      // Google login
      const authMethod = await prisma.authMethod.findFirst({
        where: {
          userId: existingUser.id,
          type: "GOOGLE",
          uniqueId: googleId,
        },
      });

      if (!authMethod) {
        return res.status(404).json({ error: "Invalid Google ID" });
      }
    } else {
      // Email login
      const authMethod = await prisma.authMethod.findFirst({
        where: { userId: existingUser.id, type: "EMAIL" },
      });

      if (!authMethod || !authMethod.password) {
        return res.status(404).json({ error: "User password not found" });
      }

      const passwordMatch = await bcrypt.compare(password, authMethod.password);

      if (!passwordMatch) {
        return res.status(403).json({ error: "Invalid password" });
      }
    }

    const payload = {
      userId: existingUser.id,
      email: existingUser.email,
    };

    const SECRET = await JWT_SECRET;

    const token = jwt.sign(payload, SECRET);

    const encryptedToken = encrypt(token, Buffer.from(await ENCRYPTION_KEY));

    res.setHeader(
      "Set-Cookie",
      `token=${encryptedToken}; Path=/; Secure; SameSite=Lax`
    );

    return res.status(200).json({ user: existingUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong while logging in." });
  }
}
