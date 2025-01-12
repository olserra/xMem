"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "../../Context";
import Link from "next/link";

// Define interfaces for the label and memory state
interface Project {
    id: string;
    name: string;
}

interface Memory {
    id: string;
    content: string;
    type: string;
    tags: string[];
    metadata?: any;
    userId: string;
    projectId?: string;
    project?: Project;
    createdAt: string;
    updatedAt: string;
}

const Memories = () => {
    const { userId } = useUser();
    const { data: session, status } = useSession();
    const [newMemory, setNewMemory] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [memory, setMemory] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterLabel, setFilterLabel] = useState<string>("");
    const [editMemoryId, setEditMemoryId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>("");
    const [editTags, setEditTags] = useState<string[]>([]);

    // Predefined tags (clusters)
    const availableTags = [
        "Personal Facts", "Preferences", "Work History", "Hobbies", "Education",
        "Skills", "Goals", "Challenges", "Achievements", "Important Dates",
        "Insights", "Experiences", "Health", "Technology", "Mindset",
        "Creativity", "Productivity", "Learning", "Well-being", "Motivation",
        "Self-Improvement"
    ];

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
    }, [session, status, userId]);

    const handleCopyToClipboard = () => {
        const allUserMemory = JSON.stringify(memory);
        navigator.clipboard.writeText(allUserMemory)
            .then(() => console.log('User data copied to clipboard'))
            .catch(err => console.error('Failed to copy user data:', err));
    };



    const handleDeleteMemory = async (id: string) => {
        try {
            const response = await fetch(`/api/memory?userId=${userId}&memoryId=${id}`, { method: "DELETE" });

            if (response.ok) {
                setMemory(memory.filter(memory => memory.id !== id));
            } else {
                setError("Failed to delete memory.");
            }
        } catch (err) {
            setError("Failed to delete memory.");
        }
    };

    const handleEditMemory = (memory: Memory) => {
        setEditMemoryId(memory.id);
        setEditText(memory.content);
        setEditTags(memory.tags);
        setNewMemory("");
        setSelectedTags([]);
    };

    const filteredMemories = memory.filter(m =>
        filterLabel
            ? m.content.toLowerCase().includes(filterLabel.toLowerCase()) ||
            m.tags.some((tag: string) => tag.toLowerCase().includes(filterLabel.toLowerCase()))
            : true
    );

    if (loading) {
        return <p>Loading memories...</p>;
    }

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                {/* Filter Memories by Tag or Text */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Filter Memories by Tag or Text</h2>
                    <input
                        type="text"
                        value={filterLabel}
                        onChange={(e) => setFilterLabel(e.target.value)}
                        placeholder="Enter text or tag to filter by"
                        className="p-2 border rounded-lg w-full"
                    />
                </div>

                {/* Display Memories */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Your Memories</h2>
                    <div className="space-y-4">
                        {filteredMemories.length === 0 ? (
                            <p>No memories found. Start creating some!</p>
                        ) : (
                            filteredMemories.map((memory: Memory) => (
                                <div key={memory.id} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="text-sm text-gray-500">
                                            {new Date(memory.createdAt).toLocaleString()}
                                        </div>
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
                                        <div className="mt-2">
                                            <strong>Tags:</strong>
                                            <div className="space-x-2 mt-2">
                                                {memory.tags.map((tag: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full bg-black"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4 space-x-4">
                                            <button onClick={() => handleEditMemory(memory)}>
                                                <FaPen className="text-black" />
                                            </button>
                                            <button onClick={() => handleDeleteMemory(memory.id)}>
                                                <FaTrash className="text-black" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Copy Data Button */}
                {filteredMemories.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-2">Copy Your Data</h2>
                        <button
                            className="flex justify-center items-center gap-2 p-2 border border-gray-500 rounded-lg cursor-pointer"
                            onClick={handleCopyToClipboard}
                            aria-label="Copy all user data"
                        >
                            <span>Copy all user data</span>
                            <FaRegCopy className="text-gray-500" size={34} />
                        </button>
                    </div>
                )}
            </div>
        </MaxWidthWrapper>
    );
};

export default Memories;
