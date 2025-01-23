"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "../../Context";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Project {
    id: string;
    name: string;
}

interface Memory {
    id: string;
    content: string;
    type: string;
    metadata?: any;
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
    const [error, setError] = useState<string | null>(null);
    const [isImport, setIsImport] = useState(false);
    const [filterLabel, setFilterLabel] = useState<string>("");
    const [importedMemories, setImportedMemories] = useState("");
    const [isCopied, setIsCopied] = useState(false);
    const [selectedMemories, setSelectedMemories] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!session || status !== "authenticated") return;

        const fetchMemory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/memory?userId=${userId}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setMemory(data); // Set memories when fetched
                } else {
                    setMemory([]);
                }
            } catch (err) {
                setError("Failed to fetch memory. Please try again.");
                setMemory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMemory();
    }, [session, status, userId, importedMemories]);

    const handleCopyToClipboard = () => {
        setIsCopied(true);

        const allUserMemory = JSON.stringify(memory);
        navigator.clipboard.writeText(allUserMemory)
            .then(() => console.log('User data copied to clipboard'))
            .catch(err => console.error('Failed to copy user data:', err));

        setTimeout(() => {
            setIsCopied(false);
        }, 1000);
    };

    const handleDeleteMemory = async (id: string) => {
        try {
            const response = await fetch(`/api/memory/${id}?userId=${userId}`, { method: "DELETE" });

            if (response.ok) {
                setMemory(memory.filter(memory => memory.id !== id));
            } else {
                setError("Failed to delete memory.");
            }
        } catch (err) {
            setError("Failed to delete memory.");
        }
    };

    const handleDeleteSelectedMemories = async () => {
        try {
            const deletePromises = Array.from(selectedMemories).map(id =>
                fetch(`/api/memory/${id}?userId=${userId}`, { method: "DELETE" })
            );
            const responses = await Promise.all(deletePromises);

            if (responses.every(response => response.ok)) {
                setMemory(memory.filter(memory => !selectedMemories.has(memory.id)));
                setSelectedMemories(new Set()); // Clear selection after delete
            } else {
                setError("Failed to delete selected memories.");
            }
        } catch (err) {
            setError("Failed to delete selected memories.");
        }
    };

    const handleImportMemories = async () => {
        setIsImport(true);
        const memories = importedMemories.split("\n").filter(Boolean);
        const newMemories = memories.map((content: string) => ({ content }));

        try {
            const response = await fetch("/api/memory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ memories: newMemories, userId }),
            });

            if (response.ok) {
                const data = await response.json();
                setMemory([...memory, ...data]);
                setImportedMemories("");
                setIsImport(false);
            } else {
                setError("Failed to import memories.");
            }
        } catch (err) {
            setError("Failed to import memories.");
        }
    }

    const handleEditMemory = (memory: Memory) => {
        const queryParams = new URLSearchParams({
            id: memory.id,
            content: memory.content,
            projectId: memory.projectId || "",
        }).toString();

        router.push(`/dashboard/memories/create?${queryParams}`);
    };

    const filteredMemories = memory.filter(m =>
        filterLabel ? m.content.toLowerCase().includes(filterLabel.toLowerCase()) : true
    );

    const toggleSelection = (id: string) => {
        setSelectedMemories(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    };

    const toggleSelectAll = () => {
        if (selectedMemories.size === filteredMemories.length) {
            setSelectedMemories(new Set());
        } else {
            setSelectedMemories(new Set(filteredMemories.map(memory => memory.id)));
        }
    };

    if (loading) {
        return <p>Loading memories...</p>;
    }

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Filter Memories By Text</h2>
                    <input
                        type="text"
                        value={filterLabel}
                        onChange={(e) => setFilterLabel(e.target.value)}
                        placeholder="Enter text to filter by"
                        className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Memories</h2>
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

                <div className="space-y-4">
                    {filteredMemories.length === 0 ? (
                        <p>No memories found. Start creating some!</p>
                    ) : (
                        filteredMemories.map((memory: Memory) => (
                            <div key={memory.id} className="border border-gray-300 bg-white p-4 rounded-lg relative">
                                <div className="flex flex-row">
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
                                            className="text-sm px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-black"></span>
                                            {memory.project.name}
                                        </Link>
                                    )}
                                </div>
                                <div>
                                    <p>{memory.content}</p>
                                    <div className="flex justify-end mt-4 space-x-4">
                                        <button onClick={() => handleEditMemory(memory)}>
                                            <FaPen className="text-black" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isImport && (
                    <div className="mt-4">
                        <textarea
                            value={importedMemories}
                            onChange={(e) => setImportedMemories(e.target.value)}
                            placeholder="Paste your memories here"
                            className="p-2 border rounded-lg w-full"
                        />
                    </div>
                )}

                <div className="flex flex-row gap-2 md:mt-4">
                    <button
                        className="mt-2 bg-black text-white py-2 px-3 rounded-lg h-10 text-sm"
                        onClick={handleImportMemories}
                    >
                        Import memories
                    </button>

                    <Link href="/dashboard/memories/create">
                        <button className="mt-2 bg-black text-white py-2 px-3 rounded-lg h-10 text-sm">Create a memory</button>
                    </Link>
                </div>
            </div>
        </MaxWidthWrapper>
    );
};

export default Memories;
