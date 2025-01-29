"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "../../Context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";

interface Project {
    id: string;
    name: string;
}

interface Memory {
    id: string;
    content: string;
    type: string;
    userId: string;
    projectId?: string;
    project?: Project;
    createdAt: string;
    updatedAt: string;
}

const Memories = () => {
    const { userId } = useUser();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [memory, setMemory] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(false);
    const [filterLabel, setFilterLabel] = useState<string>("");
    const [importedMemories, setImportedMemories] = useState<string>("");
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMemories, setSelectedMemories] = useState<Set<string>>(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [importSuccess, setImportSuccess] = useState(false);
    const [bearerToken, setBearerToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchBearerToken = async () => {
            const response = await fetch(`/api/bearer-token?userId=${userId}`);
            const data = await response.json();
            if (data.key) {
                setBearerToken(data.key);
            } else {
                console.error('Error fetching bearer token:', data.error);
            }
        };

        if (userId) {
            fetchBearerToken();
        }
    }, [userId]);

    useEffect(() => {
        if (!session || status !== "authenticated") return;

        const fetchMemory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/memory?userId=${userId}`, {
                    headers: {
                        Authorization: `Bearer ${bearerToken}`,
                    },
                });
                const data = await response.json();

                if (Array.isArray(data)) {
                    setMemory(data);
                } else {
                    setMemory([]);
                }
            } catch (err) {
                setMemory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMemory();
    }, [session, status, userId, importSuccess, bearerToken]);

    const handleCopyToClipboard = useCallback(() => {
        setIsCopied(true);
        const allUserMemory = JSON.stringify(memory);
        navigator.clipboard.writeText(allUserMemory)
            .then(() => console.log('User data copied to clipboard'))
            .catch(err => console.error('Failed to copy user data:', err));

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    }, [memory]);

    const handleDeleteMemory = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/memory/${id}?userId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            });

            if (response.ok) {
                setMemory(memory.filter((m) => m.id !== id)); // Remove the deleted memory from the state
            }
        } catch (err) {
            console.error("Failed to delete memory.");
        }
    }, [memory, userId, bearerToken]);

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
                setMemory(memory.filter((m) => !selectedMemories.has(m.id)));
                setSelectedMemories(new Set()); // Clear the selected memories after deleting
            }
        } catch (err) {
            console.error("Failed to delete selected memories.");
        }
    }, [memory, selectedMemories, userId, bearerToken]);

    const handleImportMemories = useCallback(async () => {
        setIsModalOpen(false);
        const memories = importedMemories.split("\n").filter(Boolean);
        const newMemories = memories.map((content: string) => ({ content }));

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
                setMemory(prevMemory => [...prevMemory, ...data]);
                setImportedMemories("");
                setImportSuccess(true);
            }
        } catch (err) {
            console.error("Failed to import memories.");
        }
    }, [importedMemories, userId, bearerToken]);

    const handleEditMemory = useCallback((memory: Memory) => {
        const queryParams = new URLSearchParams({
            id: memory.id,
            content: memory.content,
            projectId: memory.projectId || "",
        }).toString();

        router.push(`/dashboard/memories/create?${queryParams}`);
    }, [router]);

    const filteredMemories = useMemo(() => {
        return memory.filter(m =>
            filterLabel ? m.content.toLowerCase().includes(filterLabel.toLowerCase()) : true
        );
    }, [memory, filterLabel]);

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

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton count={5} height={80} />
            </div>
        );
    }

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                <div className="mb-6">
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold mb-2">Filter Memories By Text</h2>
                        <div className="flex items-center gap-2">
                            <button
                                className="p-2"
                                onClick={toggleSelectAll}
                                aria-label="Select All"
                            >
                                {selectedMemories.size === filteredMemories.length ? 'Deselect All' : 'Select All'}
                            </button>
                            {selectedMemories.size > 0 && (
                                <>
                                    <button
                                        className="p-2 text-black rounded-lg"
                                        onClick={handleDeleteSelectedMemories}
                                        aria-label="Delete Selected Memories"
                                    >
                                        <FaTrash />
                                    </button>
                                    <button
                                        className="p-2 text-black hover:text-gray-400"
                                        onClick={handleCopyToClipboard}
                                        aria-label="Copy all user data"
                                    >
                                        <FaRegCopy />
                                        {isCopied ? <span className="text-sm pb-1 italic text-gray-500">Copied</span> : ""}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <input
                        type="text"
                        value={filterLabel}
                        onChange={(e) => setFilterLabel(e.target.value)}
                        placeholder="Enter text to filter by"
                        className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>

                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold">Your Memories</h2>

                    <div className="flex flex-row gap-2 items-center justify-between">
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
                                    onClick={() => setIsModalOpen(false)} // Close the modal
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

                <div className="space-y-4">
                    {filteredMemories.length === 0 ? (
                        <p>No memories found. Start creating some!</p>
                    ) : (
                        filteredMemories.map((memory: Memory) => (
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
                                            onClick={() => handleDeleteMemory(memory.id)} // This should work now
                                            aria-label="Delete Memory"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default Memories;
