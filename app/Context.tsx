'use client';

import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';

interface UserContextType {
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    favorites: string[];
    filterLabel: string; // Add filterLabel to the context
    setFilterLabel: (label: string) => void; // Add function to update filter
    toggleFavorite: (projectId: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();

    const userId = session?.user?.id ?? null;
    const userEmail = session?.user?.email ?? null;
    const userName = session?.user?.name ?? null;

    // Initialize favorites from local storage or default to an empty array
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const storedFavorites = localStorage.getItem(`favorites-${userId}`);
            return storedFavorites ? JSON.parse(storedFavorites) : [];
        }
        return [];
    });

    const [filterLabel, setFilterLabel] = useState<string>("");

    const toggleFavorite = (projectId: string) => {
        setFavorites((prevFavorites) => {
            const newFavorites = prevFavorites.includes(projectId)
                ? prevFavorites.filter((id) => id !== projectId)
                : [...prevFavorites, projectId];
            // Store in localStorage
            if (typeof window !== 'undefined') {
                localStorage.setItem(`favorites-${userId}`, JSON.stringify(newFavorites));
            }
            return newFavorites;
        });
    };

    const userValue = useMemo(() => ({
        userId,
        userEmail,
        userName,
        favorites,
        filterLabel,
        setFilterLabel, // Provide the function to update filter state
        toggleFavorite
    }), [userId, userEmail, userName, favorites, filterLabel]);

    return (
        <UserContext.Provider value={userValue}>
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
