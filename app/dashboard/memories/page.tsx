"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { useUser } from "@/app/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Memories = () => {
    const {
        memories,
        filterLabel,
        bearerToken,
        userId,
        updateMemories,
        refreshMemories,
        isLoading
    } = useUser();

    const router = useRouter();
    const [importedMemories, setImportedMemories] = useState<string>("");
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMemories, setSelectedMemories] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch memories on mount
    useEffect(() => {
        refreshMemories();
    }, [refreshMemories]);

    const handleCopyToClipboard = useCallback(() => {
        setIsCopied(true);
        const allUserMemory = JSON.stringify(memories);
        navigator.clipboard.writeText(allUserMemory)
            .then(() => console.log('User data copied to clipboard'))
            .catch(err => console.error('Failed to copy user data:', err));

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }, [memories]);

    const handleDeleteMemory = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/memory/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });

            if (response.ok) {
                // Update local state and trigger refresh
                updateMemories(memories.filter((m) => m.id !== id));
                refreshMemories();
            }
        } catch (err) {
            console.error("Failed to delete memory.");
        }
    }, [memories, userId, bearerToken, updateMemories, refreshMemories]);

    const handleDeleteSelectedMemories = useCallback(async () => {
        try {
            const deletePromises = Array.from(selectedMemories).map((id) =>
                fetch(`/api/memory/${id}?userId=${userId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                    },
                })
            );
            const responses = await Promise.all(deletePromises);

            if (responses.every((response) => response.ok)) {
                // Update local state and trigger refresh
                updateMemories(memories.filter((m) => !selectedMemories.has(m.id)));
                setSelectedMemories(new Set());
                refreshMemories();
            }
        } catch (err) {
            console.error("Failed to delete selected memories.");
        }
    }, [memories, selectedMemories, userId, bearerToken, updateMemories, refreshMemories]);

    const handleImportMemories = useCallback(async () => {
        setIsModalOpen(false);
        const memoriesToImport = importedMemories.split("\n").filter(Boolean);
        const newMemories = memoriesToImport.map((content: string) => ({ content }));

        try {
            const response = await fetch("/api/memory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${bearerToken}`,
                },
                body: JSON.stringify({ memories: newMemories, userId }),
            });

            if (response.ok) {
                const data = await response.json();
                updateMemories([...memories, ...data]);
                setImportedMemories("");
                refreshMemories();
            }
        } catch (err) {
            console.error("Failed to import memories.");
        }
    }, [importedMemories, userId, bearerToken, memories, updateMemories, refreshMemories]);

    const handleEditMemory = useCallback((memory: Memory) => {
        const queryParams = new URLSearchParams({
            id: memory.id,
            content: memory.content,
            projectId: memory.projectId || "",
        }).toString();

        router.push(`/dashboard/memories/create?${queryParams}`);
    }, [router]);

    const filteredMemories = useMemo(() => {
        if (!Array.isArray(memories)) return [];
        return memories.filter(m =>
            filterLabel ? m.content.toLowerCase().includes(filterLabel.toLowerCase()) : true
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
            setSelectedMemories(new Set(filteredMemories.map(memory => memory.id)));
        }
    }, [filteredMemories, selectedMemories]);

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-semibold">Your Memories</h2>
                            <div className="flex flex-row gap-2 items-center justify-between">
                                {selectedMemories.size > 0 && (
                                    <>
                                        <button
                                            className="mt-2 p-2 text-black rounded-lg"
                                            onClick={handleDeleteSelectedMemories}
                                            aria-label="Delete Selected Memories"
                                        >
                                            <FaTrash />
                                        </button>
                                        <button
                                            className="mt-2 p-2 text-black hover:text-gray-400"
                                            onClick={handleCopyToClipboard}
                                            aria-label="Copy all user data"
                                        >
                                            <FaRegCopy />
                                            {isCopied && <span className="text-sm pb-1 italic text-gray-500">Copied</span>}
                                        </button>
                                    </>
                                )}
                                <button
                                    className="mt-2 text-black py-2 px-3 rounded-lg"
                                    onClick={toggleSelectAll}
                                    aria-label="Select All"
                                >
                                    {selectedMemories.size === filteredMemories.length ? 'Deselect All' : 'Select All'}
                                </button>
                                <button
                                    className="mt-2 text-black py-2 px-3 rounded-lg"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Import memories
                                </button>

                                <Link href="/dashboard/memories/create">
                                    <button className="mt-2 text-black py-2 px-3 rounded-lg h-10">Create a memory</button>
                                </Link>
                            </div>
                        </div>

                        {filteredMemories.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No memories found. Start creating some!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredMemories.map((memory: Memory) => (
                                    <div key={memory.id} className="border border-gray-300 bg-white p-4 rounded-lg relative">
                                        <div className="flex flex-row items-center justify-between">
                                            <div className="flex">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMemories.has(memory.id)}
                                                    onChange={() => toggleSelection(memory.id)}
                                                    className="mr-2"
                                                />
                                                <div className="text-sm text-gray-500">
                                                    {new Date(memory.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-start mb-2">
                                                {memory.projectId && memory.project && (
                                                    <Link
                                                        href={`/dashboard/projects/${memory.projectId}`}
                                                        className="text-sm px-3 py-1 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-black"></span>
                                                        {memory.project.name}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <p>{memory.content}</p>
                                            <div className="flex justify-end mt-4 space-x-4">
                                                <button onClick={() => handleEditMemory(memory)}>
                                                    <FaPen className="text-black" />
                                                </button>
                                                <button
                                                    className="p-2 text-black rounded-lg"
                                                    onClick={() => handleDeleteMemory(memory.id)}
                                                    aria-label="Delete Memory"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Modal for importing memories */}
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-8 rounded-lg w-96">
                                    <div className="flex flex-row items-center gap-4">
                                        <h3 className="text-xl font-semibold mb-4">Import Memories</h3>
                                        <Link href="/docs/core-concepts/memories" className="text-blue-500 underline mb-4">
                                            <span className="text-sm">Read more</span>
                                        </Link>
                                    </div>
                                    <textarea
                                        value={importedMemories}
                                        onChange={(e) => setImportedMemories(e.target.value)}
                                        placeholder="Paste your memories here"
                                        className="p-2 border rounded-lg w-full mb-4"
                                    />
                                    <div className="flex justify-between">
                                        <button
                                            className="bg-gray-300 text-black py-2 px-3 rounded-lg"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="bg-black text-white py-2 px-3 rounded-lg"
                                            onClick={handleImportMemories}
                                        >
                                            Import
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MaxWidthWrapper>
    );
};

export default Memories;
