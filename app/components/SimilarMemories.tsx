"use client";

import { useState, useEffect } from "react";
import { useMCPClient } from "@/app/services/mcp";
import { Loader2 } from "lucide-react";

interface Props {
    content: string;
    projectId?: string;
    onMemorySelect?: (memory: any) => void;
    className?: string;
}

export default function SimilarMemories({ content, projectId, onMemorySelect, className = "" }: Props) {
    const mcpClient = useMCPClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [similarMemories, setSimilarMemories] = useState<any[]>([]);

    useEffect(() => {
        const searchSimilar = async () => {
            if (!content.trim() || content.length < 10) {
                setSimilarMemories([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await mcpClient.semanticSearch(
                    content,
                    projectId,
                    undefined,
                    3
                );

                if (response.status === "error") {
                    throw new Error(response.error);
                }

                const results = response.data!.results;
                const memories = results.ids.map((id, index) => ({
                    id,
                    content: results.documents[index],
                    similarity: 1 - results.distances[index],
                    metadata: {
                        ...results.metadatas[index],
                        tags: results.metadatas[index].tags || [],
                        created_at: results.metadatas[index].created_at || new Date().toISOString()
                    }
                }));

                setSimilarMemories(memories);
            } catch (err: any) {
                setError(err.message || "Failed to find similar memories");
                setSimilarMemories([]);
            } finally {
                setLoading(false);
            }
        };

        // Debounce a busca para não sobrecarregar
        const timeoutId = setTimeout(searchSimilar, 500);
        return () => clearTimeout(timeoutId);
    }, [content, projectId, mcpClient]);

    if (!content.trim() || content.length < 10) {
        return null;
    }

    return (
        <div className={`mt-4 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">
                    Similar Memories
                </h3>
                {loading && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                )}
            </div>

            {error && (
                <div className="text-sm text-red-500 mb-2">
                    {error}
                </div>
            )}

            {similarMemories.length > 0 ? (
                <div className="space-y-2">
                    {similarMemories.map((memory) => (
                        <div
                            key={memory.id}
                            onClick={() => onMemorySelect?.(memory)}
                            className="p-3 border rounded bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-900 line-clamp-2">
                                        {memory.content}
                                    </p>
                                    {memory.metadata.tags.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {memory.metadata.tags.map((tag: string) => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-0.5 text-xs bg-white text-gray-600 rounded-full border"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <span className="ml-2 text-xs text-gray-500">
                                    {(memory.similarity * 100).toFixed(1)}% match
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : !loading && (
                <p className="text-sm text-gray-500">
                    No similar memories found
                </p>
            )}
        </div>
    );
} 