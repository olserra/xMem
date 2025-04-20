"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { useUser } from "@/app/contexts/UserContext";
import SimilarMemories from "@/app/components/SimilarMemories";

interface FormData {
    content: string;
    tags: string[];
    type: string;
}

function useWindowSize() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 640);
        }

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

export default function CreateData() {
    const { user, bearerToken, refreshData } = useUser();
    const userId = user?.id;
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const isEditing = !!searchParams.get('id');
    const [formData, setFormData] = useState<FormData>({
        content: searchParams.get('content') || '',
        tags: searchParams.get('tags')?.split(',').filter(Boolean) || [],
        type: 'TEXT'
    });
    const [newTag, setNewTag] = useState('');
    const [showSimilar, setShowSimilar] = useState(true);

    const handleAddTag = () => {
        if (newTag.trim() && formData.tags.length < 5) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.content.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const id = searchParams.get('id');
            const url = id ? `/api/data/${id}` : '/api/data';
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(bearerToken && { Authorization: `Bearer ${bearerToken}` })
                },
                body: JSON.stringify({
                    ...formData,
                    userId,
                    metadata: {
                        tags: formData.tags
                    }
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'create'} data`);
            }

            await refreshData();
            router.push('/dashboard/data');
        } catch (err: any) {
            setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} data. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const handleSimilarMemorySelect = (memory: any) => {
        setFormData(prev => ({
            ...prev,
            content: memory.content,
            tags: [...new Set([...prev.tags, ...(memory.metadata.tags || [])])].slice(0, 5)
        }));
    };

    return (
        <MaxWidthWrapper>
            <div className="py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Create New Data</h1>
                    <button
                        type="button"
                        onClick={() => setShowSimilar(!showSimilar)}
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        {showSimilar ? 'Hide Similar' : 'Show Similar'}
                    </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full p-2 border rounded-lg"
                                rows={4}
                                placeholder="Enter your text content..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tags (max 5)
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 p-2 border rounded-lg"
                                    placeholder="Add a tag..."
                                    maxLength={20}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    disabled={!newTag.trim() || formData.tags.length >= 5}
                                    className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <div
                                        key={tag}
                                        className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !formData.content.trim()}
                            className="w-full sm:w-auto px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : isEditing ? 'Save' : 'Create Text Data'}
                        </button>
                    </form>

                    {showSimilar && (
                        <div className="lg:col-span-1">
                            <SimilarMemories
                                content={formData.content}
                                onMemorySelect={handleSimilarMemorySelect}
                            />
                        </div>
                    )}
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
