'use client';

import { useCallback, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useBearerToken from './hooks/useBearerToken';

interface UserContextType {
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    bearerToken: string | null;
    projects: Project[];
    memories: Memory[];
    favorites: string[];
    filterLabel: string;
    setFilterLabel: (label: string) => void;
    toggleFavorite: (projectId: string) => void;
    updateMemories: (memories: Memory[]) => void;
    refreshMemories: () => Promise<void>;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [memories, setMemories] = useState<Memory[]>([]);
    const [filterLabel, setFilterLabel] = useState<string>("");

    const userId = session?.user?.id ?? null;
    const userEmail = session?.user?.email ?? null;
    const userName = session?.user?.name ?? null;
    const bearerToken = useBearerToken(userId);

    // Initialize favorites from local storage with useMemo
    const [favorites, setFavorites] = useState<string[]>(() => {
        if (typeof window !== 'undefined') {
            const storedFavorites = localStorage.getItem(`favorites-${userId}`);
            return storedFavorites ? JSON.parse(storedFavorites) : [];
        }
        return [];
    });

    // Memoized fetch function
    const fetchData = useCallback(async () => {
        if (!userId || !bearerToken) return;
        setIsLoading(true);

        try {
            const [projectsRes, memoriesRes] = await Promise.all([
                fetch(`/api/projects?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${bearerToken}` },
                }),
                fetch(`/api/memory?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${bearerToken}` },
                }),
            ]);

            const projectsData = await projectsRes.json();
            const memoriesData = await memoriesRes.json();

            setProjects(projectsData);
            setMemories(memoriesData.memories || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, bearerToken]);

    // Memoized refresh memories function
    const refreshMemories = useCallback(async () => {
        if (!userId || !bearerToken) return;
        setIsLoading(true);

        try {
            const response = await fetch(`/api/memory?userId=${userId}`, {
                headers: { Authorization: `Bearer ${bearerToken}` },
            });
            const data = await response.json();
            setMemories(data.memories || []);
        } catch (error) {
            console.error("Error refreshing memories:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userId, bearerToken]);

    // Memoized update memories function
    const updateMemories = useCallback((newMemories: Memory[]) => {
        setMemories(prev => {
            // If the new memories array is empty, refresh from server
            if (newMemories.length === 0) {
                refreshMemories();
                return prev;
            }
            return newMemories;
        });
    }, [refreshMemories]);

    // Memoized toggle favorite function
    const toggleFavorite = useCallback((projectId: string) => {
        setFavorites(prevFavorites => {
            const newFavorites = prevFavorites.includes(projectId)
                ? prevFavorites.filter(id => id !== projectId)
                : [...prevFavorites, projectId];
            
            if (typeof window !== 'undefined') {
                localStorage.setItem(`favorites-${userId}`, JSON.stringify(newFavorites));
            }
            return newFavorites;
        });
    }, [userId]);

    // Initial data fetch
    useEffect(() => {
        if (userId && bearerToken) {
            fetchData();
        }
    }, [userId, bearerToken, fetchData]);

    // Memoized context value
    const contextValue = useMemo(() => ({
        userId,
        userEmail,
        userName,
        bearerToken,
        projects,
        memories,
        favorites,
        filterLabel,
        isLoading,
        setFilterLabel,
        toggleFavorite,
        updateMemories,
        refreshMemories,
    }), [
        userId,
        userEmail,
        userName,
        bearerToken,
        projects,
        memories,
        favorites,
        filterLabel,
        isLoading,
        toggleFavorite,
        updateMemories,
        refreshMemories,
    ]);

    return (
        <UserContext.Provider value={contextValue}>
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
