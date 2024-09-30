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
      allowDangerousEmailAccountLinking: true,
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
    async redirect() {
      return "/";
    },
    session: async ({ session, token, user }: any) => {
      session.user.id = user.id as string;
      return session;
    },
  },
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };
