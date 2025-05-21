'use client';
import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
    search: string;
    setSearch: (v: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function useSearch() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
    return ctx;
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState('');
    return (
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    );
} 