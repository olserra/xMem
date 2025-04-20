import { NextAuthOptions, User, Account, Profile, Session } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from '@/lib/prisma';
import NextAuth from "next-auth"
import { JWT } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
  debug: true,
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
    async signIn({ user, account, profile }: { 
      user: User; 
      account: Account | null; 
      profile?: Profile 
    }) {
      console.log("SignIn Attempt:", { user, account, profile });
      return true;
    },
    async session({ session, user }: { 
      session: Session; 
      user: User 
    }) {
      console.log("Session Callback - Initial session:", session);
      console.log("Session Callback - User:", user);

      if (!session.user) {
        return session;
      }

      try {
        // Get the user from the database
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email || '' },
        });

        console.log("Session Callback - DB User:", dbUser);

        if (dbUser) {
          // Update session with database user data
          session.user.id = dbUser.id;
          session.user.name = dbUser.name || session.user.name;
          session.user.email = dbUser.email || session.user.email;
          session.user.image = dbUser.image || session.user.image;
        } else {
          // Create new user if they don't exist
          const newUser = await prisma.user.create({
            data: {
              email: session.user.email || '',
              name: session.user.name || '',
              image: session.user.image || '',
            },
          });
          console.log("Session Callback - Created new user:", newUser);
          session.user.id = newUser.id;
        }

        console.log("Session Callback - Final session:", {
          userId: session.user.id,
          email: session.user.email,
          name: session.user.name,
        });

        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },
    async jwt({ token, user, account }: { 
      token: JWT; 
      user?: User | null; 
      account?: Account | null 
    }) {
      console.log("JWT Callback - Initial token:", token);
      console.log("JWT Callback - User:", user);
      console.log("JWT Callback - Account:", account);

      if (user) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }

      console.log("JWT Callback - Final token:", token);
      return token;
    },
    async redirect({ url, baseUrl }: { 
      url: string; 
      baseUrl: string 
    }) {
      console.log("Redirect Callback - URL:", url);
      console.log("Redirect Callback - Base URL:", baseUrl);
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
} 