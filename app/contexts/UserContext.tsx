'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Data } from '@/app/types/_data';

interface UserContextType {
    user: any;
    data: Data[];
    bearerToken: string | null;
    isLoading: boolean;
    refreshData: () => Promise<void>;
    filterLabel: string;
    setFilterLabel: (label: string) => void;
    userId: string;
    updateData: (data: Data[]) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    data: [],
    bearerToken: null,
    isLoading: true,
    refreshData: async () => { },
    filterLabel: '',
    setFilterLabel: () => { },
    userId: '',
    updateData: () => { },
});

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<any>(null);
    const [data, setData] = useState<Data[]>([]);
    const [bearerToken, setBearerToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterLabel, setFilterLabel] = useState<string>('');

    const fetchUser = async () => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch(`/api/users/${session.user.id}`);
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchBearerToken = async () => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch(`/api/bearer-token?userId=${session.user.id}`);
            if (response.ok) {
                const data = await response.json();
                setBearerToken(data.key);
            }
        } catch (error) {
            console.error('Error fetching bearer token:', error);
        }
    };

    const refreshData = async () => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch('/api/data');
            if (response.ok) {
                const { data: dataData } = await response.json();
                setData(dataData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initializeData = async () => {
            if (status === 'authenticated' && mounted) {
                try {
                    await Promise.all([
                        fetchUser(),
                        fetchBearerToken(),
                        refreshData()
                    ]);
                } finally {
                    if (mounted) {
                        setIsLoading(false);
                    }
                }
            } else if (status === 'unauthenticated' && mounted) {
                setIsLoading(false);
            }
        };

        initializeData();

        return () => {
            mounted = false;
        };
    }, [status]);

    return (
        <UserContext.Provider
            value={{
                user,
                data,
                bearerToken,
                isLoading,
                refreshData,
                filterLabel,
                setFilterLabel,
                userId: session?.user?.id || '',
                updateData: setData
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};