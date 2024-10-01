'use client'; // Ensure this is a Client Component

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface UserContextType {
    userId: any | null;
    userEmail: any | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();

    // @ts-ignore
    const userId = session?.user?.id || null;
    const userEmail = session?.user?.email || null;

    return (
        <UserContext.Provider value={{ userId, userEmail }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
