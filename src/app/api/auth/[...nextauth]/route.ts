// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../../prisma/prisma";

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
    async signIn({ user, account, profile }: { user: any; account: any; profile: any }) {
      console.log("SignIn Attempt:", { user, account, profile });
      return true;
    },
    async session({ session, token, user }: { session: any; token: any; user: any }) {
      console.log("Session Callback:", { session, token, user });
      session.user.id = user.id as string;
      return session;
    },
    async redirect() {
      return "/dashboard/projects";
    },
  },

};

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