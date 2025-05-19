'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a User type
interface User {
    name: string;
    // Add more fields as needed
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for auth_token cookie
        const match = document.cookie.match(/auth_token=([^;]+)/);
        if (match) {
            setUser({ name: 'User' }); // You can expand this with real user data
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
} 