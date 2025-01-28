import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../prisma/prisma";

const options: NextAuthOptions = {
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
        async signIn({ user, account, profile }) {
            console.log("SignIn Attempt:", { user, account, profile });
            return true;
        },
        async session({ session, token, user }) {
            console.log("Session Callback:", { session, token, user });
            session.user.id = user.id;
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url === '/api/auth/signout') {
                return '/';
            }

            if (url.startsWith(baseUrl)) return url;
            return "/dashboard/projects";
        },
    },

};

const handler = NextAuth(options);

export { handler as GET, handler as POST };