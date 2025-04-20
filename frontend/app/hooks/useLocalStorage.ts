import { useState, useCallback, useEffect } from 'react';

export function useLocalStorage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const getItem = useCallback(<T>(key: string): T | null => {
        if (!isClient) return null;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage key "${key}":`, error);
            return null;
        }
    }, [isClient]);

    const setItem = useCallback((key: string, value: any): void => {
        if (!isClient) return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }, [isClient]);

    const removeItem = useCallback((key: string): void => {
        if (!isClient) return;

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing localStorage key "${key}":`, error);
        }
    }, [isClient]);

    const clear = useCallback((): void => {
        if (!isClient) return;

        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }, [isClient]);

    return {
        getItem,
        setItem,
        removeItem,
        clear,
        isReady: isClient,
    };
} 