"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from '@/app/Context';
import { useSession } from 'next-auth/react';
import { FaRegCopy, FaTrash, FaPen } from 'react-icons/fa';

interface Memory {
    id: string;
    content: string;
    type: string;
    userId: string;
    projectId?: string;
    project?: { name: string };
    createdAt: string;
    updatedAt: string;
}

export default function MemoriesPage() {
    const { userId, filterLabel } = useUser();
    const [memories, setMemories] = useState<Memory[]>([]);
    const { data: session, status } = useSession();
    const [selectedMemories, setSelectedMemories] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/";
        }
    }, [status]);

    useEffect(() => {
        const fetchMemories = async () => {
            if (!userId && session) return;

            try {
                const response = await fetch(`/api/memory?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch memories');
                }
                const data = await response.json();
                setMemories(data);
            } catch (error) {
                console.error('Error fetching memories:', error);
            }
        };

        fetchMemories();
    }, [session, userId]);

    // Apply the filter using the filterLabel from context
    const filteredMemories = useMemo(() => {
        return memories.filter(memory =>
            filterLabel ? memory.content.toLowerCase().includes(filterLabel.toLowerCase()) : true
        );
    }, [memories, filterLabel]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedMemories(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedMemories.size === filteredMemories.length) {
            setSelectedMemories(new Set());
        } else {
            setSelectedMemories(new Set(filteredMemories.map((memory) => memory.id)));
        }
    }, [filteredMemories, selectedMemories]);

    const handleDeleteSelectedMemories = useCallback(async () => {
        try {
            const deletePromises = Array.from(selectedMemories).map((id) =>
                fetch(`/api/memory/${id}?userId=${userId}`, { method: "DELETE" })
            );
            const responses = await Promise.all(deletePromises);

            if (responses.every((response) => response.ok)) {
                setMemories(memories.filter((m) => !selectedMemories.has(m.id)));
                setSelectedMemories(new Set()); // Clear the selected memories after deleting
            }
        } catch (err) {
            console.error("Failed to delete selected memories.");
        }
    }, [memories, selectedMemories, userId]);

    const copySelectedToClipboard = () => {
        const selectedContent = filteredMemories
            .filter(memory => selectedMemories.has(memory.id))
            .map(memory => memory.content)
            .join("\n\n");

        if (selectedContent) {
            navigator.clipboard.writeText(selectedContent)
                .then(() => alert("Copied selected memories to clipboard!"))
                .catch((err) => console.error("Error copying text: ", err));
        }
    };


    return (
        <MaxWidthWrapper>
            <div className="py-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Memories</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            className="text-black py-2 px-3 rounded-lg"
                            onClick={toggleSelectAll}
                        >
                            {selectedMemories.size === filteredMemories.length ? 'Deselect All' : 'Select All'}
                        </button>
                        {selectedMemories.size > 0 && (
                            <div className='flex gap-2'>
                                <button
                                    className="text-black py-2 px-3 rounded-lg"
                                    onClick={handleDeleteSelectedMemories}
                                >
                                    <FaTrash />
                                </button>
                                <button
                                    className="text-black py-2 px-3 rounded-lg"
                                    onClick={copySelectedToClipboard}
                                >
                                    <FaRegCopy />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-4">
                    {filteredMemories.length === 0 ? (
                        <p>No memories found. Start creating some!</p>
                    ) : (
                        filteredMemories.map((memory: Memory) => (
                            <div key={memory.id} className="border border-gray-300 bg-white p-4 rounded-lg relative">
                                <div className="flex justify-start mb-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedMemories.has(memory.id)}
                                        onChange={() => toggleSelection(memory.id)}
                                        className="mr-4"
                                    />
                                    <div className="text-sm text-gray-500">
                                        {new Date(memory.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <p>{memory.content}</p>
                                <div className="flex justify-end mt-4 space-x-4">
                                    <button>
                                        <FaPen className="text-black" />
                                    </button>
                                    <button
                                        className="p-2 text-black rounded-lg"
                                        aria-label="Delete Memory"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </MaxWidthWrapper>
    );
}
