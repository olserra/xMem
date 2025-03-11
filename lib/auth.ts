import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '@/prisma/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async signIn({ user, account, profile }) {
      console.log("SignIn Attempt:", { user, account, profile });
      return true;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      // Ensure token exists and has required properties
      if (!token) {
        return session;
      }

      // Set basic user properties
      session.user.id = token.sub || '';
      session.user.name = token.name || '';
      session.user.email = token.email || '';
      session.user.image = token.picture || '';

      // Only try to get/create user if we have a valid ID
      if (token.sub) {
        try {
          const dbUser = await prisma.user.upsert({
            where: { id: token.sub },
            update: {
              name: token.name || '',
              email: token.email || '',
              image: token.picture || '',
            },
            create: {
              id: token.sub,
              name: token.name || '',
              email: token.email || '',
              image: token.picture || '',
            },
          });

        } catch (error) {
          console.error('Error updating user:', error);
        }
      }

      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async redirect() {
      return "/";
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
} 