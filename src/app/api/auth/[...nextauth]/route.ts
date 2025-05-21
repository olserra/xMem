// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../../prisma/prisma";
import { Session } from "next-auth";

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }: { user: unknown; account: unknown; profile: unknown }) {
      console.log("SignIn Attempt:", { user, account, profile });
      return true;
    },
    async session({ session, token, user }: { session: Session; token: unknown; user: unknown }) {
      console.log("Session Callback:", { session, token, user });
      if (session.user) {
        (session.user as { id?: string }).id = (user as { id?: string }).id as string;
      }
      return session as Session;
    },
    async redirect() {
      return "/dashboard";
    },
  },

};

export const authOptions = options;

const handler = NextAuth({
  ...options,
  callbacks: {
    ...options.callbacks,
    signIn: async ({ user, account, profile, email, credentials }) => {
      console.log("SignIn Attempt:", { user, account, profile, email, credentials });
      return true;
    },
  },
});

export { handler as GET, handler as POST };