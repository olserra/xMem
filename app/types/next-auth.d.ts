import NextAuth from "next-auth";

// Extend the `NextAuth` types to include `id` in `user`
declare module "next-auth" {
    interface Session {
        user: {
            id: string; // Add `id` property here
            email?: string | null;
            name?: string | null;
            image?: string | null;
        };
    }

    interface User {
        id: string; // Add `id` property here
        email?: string | null;
        name?: string | null;
        image?: string | null;
    }
}
