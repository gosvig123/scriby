// pages/api/user/myuser.js
import { getSession } from "next-auth/react";
import { prisma } from "../../../../prisma/db";
import { emails } from "../../../../services/mailService/sendEmail";

export default async function handle(req: any, res: any) {
  if (req.method === "GET") {
    const session = await getSession({ req });

    if (!session || !session.user || !session.user.email) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          credits: true,
          id: true,
          email: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).end(); // Method not allowed
  }
}
