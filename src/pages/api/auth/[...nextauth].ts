import NextAuth from "next-auth";

import googleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    googleProvider({
      clientId:
        "358155175620-tmo0ped23qte9gpnv4dovqr1i6tj11r6.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  callbacks: {
    async redirect() {
      // Fixed URL to redirect to after successful sign in
      return "/dashboard"; // Replace with your desired URL
    },
  },
};

export default NextAuth(authOptions);
