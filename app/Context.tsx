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
    const { data: session, status } = useSession();
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
        if (typeof window !== 'undefined' && userId) {
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
            // First get the bearer token
            const tokenResponse = await fetch(`/api/bearer-token?userId=${userId}`);
            const tokenData = await tokenResponse.json();

            if (!tokenData.key) {
                console.error('No bearer token available');
                return;
            }

            const headers = {
                'Authorization': `Bearer ${tokenData.key}`,
                'Content-Type': 'application/json'
            };

            const [projectsRes, memoriesRes] = await Promise.all([
                fetch('/api/projects', {
                    headers
                }),
                fetch('/api/memory', {
                    headers
                }),
            ]);

            if (!projectsRes.ok || !memoriesRes.ok) {
                throw new Error('Failed to fetch data');
            }

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
            const tokenResponse = await fetch(`/api/bearer-token?userId=${userId}`);
            const tokenData = await tokenResponse.json();

            if (!tokenData.key) {
                console.error('No bearer token available');
                return;
            }

            const response = await fetch('/api/memory', {
                headers: {
                    'Authorization': `Bearer ${tokenData.key}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch memories');
            }

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

            if (typeof window !== 'undefined' && userId) {
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
