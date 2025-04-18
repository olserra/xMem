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
    const [retryCount, setRetryCount] = useState(0);

    const fetchUser = async () => {
        if (!session?.user?.id) return null;

        try {
            const response = await fetch(`/api/users/${session.user.id}`);
            if (response.ok) {
                const userData = await response.json();
                return userData;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    const fetchBearerToken = async () => {
        if (!session?.user?.id) return null;

        try {
            const response = await fetch(`/api/bearer-token?userId=${session.user.id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch bearer token: ${response.status}`);
            }
            const data = await response.json();
            if (!data.key) {
                throw new Error('No bearer token received');
            }
            return data.key;
        } catch (error) {
            console.error('Error fetching bearer token:', error);
            return null;
        }
    };

    const refreshData = async () => {
        if (!session?.user?.id || !bearerToken) return;

        try {
            const response = await fetch('/api/data', {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });
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
        let retryTimeout: NodeJS.Timeout;

        const initializeData = async () => {
            if (status === 'authenticated' && mounted) {
                try {
                    const [userData, token] = await Promise.all([
                        fetchUser(),
                        fetchBearerToken()
                    ]);

                    if (mounted) {
                        if (userData) {
                            setUser(userData);
                        }
                        
                        if (token) {
                            setBearerToken(token);
                            setRetryCount(0); // Reset retry count on success
                        } else if (retryCount < 3) { // Retry up to 3 times
                            setRetryCount(prev => prev + 1);
                            retryTimeout = setTimeout(initializeData, 2000); // Retry after 2 seconds
                            return;
                        }
                    }
                } finally {
                    if (mounted) {
                        setIsLoading(false);
                    }
                }
            } else if (status === 'unauthenticated' && mounted) {
                setUser(null);
                setBearerToken(null);
                setData([]);
                setIsLoading(false);
            }
        };

        initializeData();

        return () => {
            mounted = false;
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
        };
    }, [status, retryCount]);

    // Refresh data when bearer token becomes available
    useEffect(() => {
        if (bearerToken) {
            refreshData();
        }
    }, [bearerToken]);

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