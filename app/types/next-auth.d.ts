import NextAuth from "next-auth";
import { Role } from "./auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string | null;
            email: string | null;
            image: string | null;
            role: Role;
        };
    }
}