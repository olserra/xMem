"use client";

import { useState, useCallback, useEffect } from "react";
import { useMCPClient } from "@/app/services/mcp";
import { useDebounce } from "@/app/hooks/useDebounce";
import { Loader2 } from "lucide-react";

interface SearchResult {
    id: string;
    content: string;
    similarity: number;
    metadata: {
        tags: string[];
        project_id?: string;
        created_at: string;
        [key: string]: any;  // Permitir outros campos de metadados
    };
}

interface Props {
    projectId?: string;
    onResultSelect?: (result: SearchResult) => void;
    className?: string;
}

export default function SemanticSearch({ projectId, onResultSelect, className = "" }: Props) {
    const mcpClient = useMCPClient();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const debouncedQuery = useDebounce(query, 300);
    
    const searchMemories = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await mcpClient.semanticSearch(
                searchQuery,
                projectId,
                undefined,
                5
            );
            
            if (response.status === "error") {
                throw new Error(response.error);
            }
            
            const searchResults = response.data!.results;
            const formattedResults: SearchResult[] = searchResults.ids.map((id, index) => ({
                id,
                content: searchResults.documents[index],
                similarity: 1 - searchResults.distances[index],
                metadata: {
                    ...searchResults.metadatas[index],
                    tags: searchResults.metadatas[index].tags || [],
                    created_at: searchResults.metadatas[index].created_at || new Date().toISOString()
                }
            }));
            
            setResults(formattedResults);
        } catch (err: any) {
            setError(err.message || "Failed to search memories");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [mcpClient, projectId]);
    
    useEffect(() => {
        searchMemories(debouncedQuery);
    }, [debouncedQuery, searchMemories]);
    
    return (
        <div className={`w-full ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search memories semantically..."
                    className="w-full p-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
                />
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                )}
            </div>
            
            {error && (
                <div className="mt-2 text-sm text-red-500">
                    {error}
                </div>
            )}
            
            {results.length > 0 && (
                <div className="mt-4 space-y-4">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            onClick={() => onResultSelect?.(result)}
                            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 line-clamp-2">
                                        {result.content}
                                    </p>
                                    {result.metadata.tags.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {result.metadata.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex flex-col items-end">
                                    <span className="text-xs text-gray-500">
                                        {(result.similarity * 100).toFixed(1)}% match
                                    </span>
                                    <span className="text-xs text-gray-400 mt-1">
                                        {new Date(result.metadata.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 