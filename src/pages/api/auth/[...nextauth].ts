import { User } from "@prisma/client";
import googleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { prisma } from "../../../../prisma/db";
import NextAuth from "next-auth";
export const authOptions = {
  providers: [
    googleProvider({
      clientId:
        "358155175620-tmo0ped23qte9gpnv4dovqr1i6tj11r6.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        try {
          if (!credentials || !credentials.email || !credentials.password) {
            return null;
          }

          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found");
          }

          const authMethod = await prisma.authMethod.findFirst({
            where: { userId: user.id, type: "EMAIL" },
          });

          if (!authMethod || !authMethod.password) {
            throw new Error("User password not found");
          }

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            authMethod.password
          );

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          return user;
        } catch (error) {
          console.log("error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (user.email) {
        try {
          const existingUser = await prisma.user.findFirst({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                // Add other fields as required by your user model
                authMethods: {
                  create: {
                    type: account.provider.toUpperCase(),
                    uniqueId:
                      account.provider === "google"
                        ? account.providerAccountId
                        : undefined,
                    verified: account.provider === "google",
                  },
                },
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      return false;
    },
    callbacks: {
      async redirect({ url, baseUrl }: any) {
        if (url.startsWith(`${baseUrl}/api/auth/callback`)) {
          return "/dashboard";
        }
    
        if (url.startsWith(`${baseUrl}/api/auth/signout`)) {
          return baseUrl;
        }
    
        return baseUrl;
      },
    },
    
  },
};

export default NextAuth(authOptions);
