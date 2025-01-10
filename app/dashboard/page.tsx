"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "../Context";

// Define interfaces for the label and memory state
interface Memory {
    id: string;
    data: {
        text: string;
        tags: string[];
        createdAt: string;
    };
    [x: string]: any;
}

const Dashboard = () => {
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

    const handleNewMemorySubmit = async () => {
        if (newMemory.length === 0) {
            setError("Memory cannot be empty.");
            return;
        }

        if (selectedTags.length !== 3) {
            setError("You must select exactly 3 tags.");
            return;
        }

        try {
            const response: Response = await fetch(`/api/memory?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newMemory, tags: selectedTags }),
            });

            if (!response.ok) {
                throw new Error("Failed to create a new memory");
            }

            const newMemoryData = await response.json();
            setMemory(prevMemory => [...prevMemory, newMemoryData]);
            setNewMemory("");
            setSelectedTags([]);
            setError(null);
        } catch (err) {
            setError("Failed to create a new memory. Please try again.");
        }
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
        setEditText(memory.data.text);
        setEditTags(memory.data.tags);
        setNewMemory("");
        setSelectedTags([]);
    };

    const handleUpdateMemory = async () => {
        if (editText.length === 0) {
            setError("Memory cannot be empty.");
            return;
        }

        if (editTags.length !== 3) {
            setError("You must select exactly 3 tags.");
            return;
        }

        try {
            const response = await fetch(`/api/memories?userId=${userId}&memoryId=${editMemoryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: editText, tags: editTags }),
            });

            if (response.ok) {
                const updatedMemory = await response.json();
                setMemory(memory.map(memory => memory.id === editMemoryId ? updatedMemory : memory));
                setEditMemoryId(null);
                setEditText("");
                setEditTags([]);
            } else {
                setError("Failed to update memory.");
            }
        } catch (err) {
            setError("Failed to update memory.");
        }
    };

    const filteredMemories = memory.filter(m =>
        filterLabel ? m.data.text.includes(filterLabel) || m.data.tags.some((tag: string) => tag.includes(filterLabel)) : true
    );

    if (loading) {
        return <p>Loading memories...</p>;
    }

    const handleTagToggle = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else if (selectedTags.length < 3) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                {/* New Memory Form */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Create New Memory</h2>
                    <textarea
                        value={editMemoryId ? editText : newMemory}
                        onChange={(e) => { editMemoryId ? setEditText(e.target.value) : setNewMemory(e.target.value); }}
                        placeholder="Enter your thoughts here..."
                        rows={5}
                        className="w-full p-3 border rounded-lg"
                    />
                    <div className="mt-4">
                        <h3 className="text-lg">Select 3 Tags</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {availableTags.map((tag, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-3 py-1 text-sm font-medium rounded-full cursor-pointer ${selectedTags.includes(tag) ? 'bg-black text-white' : 'bg-gray-300 text-black'}`}
                                    title={`Tag: ${tag}`} // Add tooltip for each tag
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <button
                            onClick={editMemoryId ? handleUpdateMemory : handleNewMemorySubmit}
                            className="bg-black text-white px-4 py-2 rounded-lg"
                        >
                            {editMemoryId ? "Save" : "Submit"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

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
                                    <div className="text-sm text-gray-500 mb-2">
                                        {new Date(memory.createdAt).toLocaleString()}
                                    </div>
                                    <div>
                                        <p>{memory.data.text}</p>
                                        <div className="mt-2">
                                            <strong>Tags:</strong>
                                            <div className="space-x-2 mt-2">
                                                {memory.data.tags.map((tag: string, index: number) => (
                                                    <span key={index} className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full bg-black">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4 space-x-4">
                                            <button onClick={() => handleEditMemory(memory)}>
                                                <FaPen className="text-blue-500" />
                                            </button>
                                            <button onClick={() => handleDeleteMemory(memory.id)}>
                                                <FaTrash className="text-red-500" />
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

export default Dashboard;
