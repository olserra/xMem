'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
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