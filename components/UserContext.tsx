// components/UserContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

interface UserContextType {
    userId: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();

    // Access the user ID directly from the session object
    const userId = session?.user?.email ? session.user.email : null; // Use email as a fallback or any other identifier

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
