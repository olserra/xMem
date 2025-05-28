'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TagMap {
    [id: string]: string[];
}

interface TagContextType {
    tagsMap: TagMap;
    setTagsForId: (id: string, tags: string[]) => void;
    getTagsForId: (id: string) => string[];
    setBulkTags: (bulk: TagMap) => void;
    clearTags: () => void;
}

const TagContext = createContext<TagContextType | undefined>(undefined);

export const TagProvider = ({ children }: { children: ReactNode }) => {
    const [tagsMap, setTagsMap] = useState<TagMap>({});

    const setTagsForId = (id: string, tags: string[]) => {
        setTagsMap(prev => ({ ...prev, [id]: tags }));
    };

    const getTagsForId = (id: string) => {
        return tagsMap[id] || [];
    };

    const setBulkTags = (bulk: TagMap) => {
        setTagsMap(prev => ({ ...prev, ...bulk }));
    };

    const clearTags = () => {
        setTagsMap({});
    };

    return (
        <TagContext.Provider value={{ tagsMap, setTagsForId, getTagsForId, setBulkTags, clearTags }}>
            {children}
        </TagContext.Provider>
    );
};

export const useTagContext = () => {
    const ctx = useContext(TagContext);
    if (!ctx) throw new Error('useTagContext must be used within a TagProvider');
    return ctx;
}; 