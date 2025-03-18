"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/app/contexts/UserContext";

type Props = {
    children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
    return (
        <SessionProvider>
            <UserProvider>
                {children}
            </UserProvider>
        </SessionProvider>
    );
};
