// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../prisma/prisma";

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  callbacks: {
    jwt: async ({ token, user }: any) => {
      // If user exists, add user id to token
      if (user) {
        token.sub = user.id; // or however you retrieve the user ID
      }
      return token;
    },
    session: ({ session, token }: any) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
        },
      };
    },
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
