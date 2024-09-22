'use client'; // Ensure this is a Client Component

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface UserContextType {
    userId: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    console.log(session, "data")

    const userId = session?.user?.email || null;

    return (
        <UserContext.Provider value={{ userId }}>
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
