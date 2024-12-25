"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "../Context";

// Define interfaces for the label and entry state
interface Entry {
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
    const [newEntry, setNewEntry] = useState<string>("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterLabel, setFilterLabel] = useState<string>("");
    const [editEntryId, setEditEntryId] = useState<string | null>(null);
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

        const fetchEntries = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/entries?userId=${userId}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setEntries(data); // Set entries when fetched
                } else {
                    setEntries([]);
                }
            } catch (err) {
                setError("Failed to fetch entries");
                setEntries([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();
    }, [session, status, userId]); // Re-fetch entries when session changes

    const handleCopyToClipboard = () => {
        const allUserData = JSON.stringify(entries);
        navigator.clipboard.writeText(allUserData)
            .then(() => console.log('User data copied to clipboard'))
            .catch(err => console.error('Failed to copy user data:', err));
    };

    const handleNewEntrySubmit = async () => {
        if (newEntry.length === 0) {
            setError("Entry cannot be empty.");
            return;
        }

        if (selectedTags.length !== 3) {
            setError("You must select exactly 3 tags.");
            return;
        }

        try {
            const response = await fetch(`/api/entries?userId=${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newEntry, tags: selectedTags }),
            });

            if (!response.ok) {
                throw new Error("Failed to create a new entry");
            }

            const newEntryData = await response.json();
            console.log("New entry created:", newEntryData); // Debugging log

            // Add the new entry to the existing entries array in the state
            setEntries(prevEntries => [...prevEntries, newEntryData]);

            // Reset fields after submission
            setNewEntry("");
            setSelectedTags([]);
            setError(null);

        } catch (err) {
            if (err instanceof Error) {
                setError(`Failed to create a new entry: ${err.message}`);
            } else {
                setError("Failed to create a new entry");
            }
        }
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            const response = await fetch(`/api/entries?userId=${userId}&entryId=${id}`, { method: "DELETE" });

            if (response.ok) {
                setEntries(entries.filter(entry => entry.id !== id)); // Directly update the state to remove the entry
            } else {
                setError("Failed to delete entry.");
            }
        } catch (err) {
            setError("Failed to delete entry.");
        }
    };

    const handleEditEntry = (entry: Entry) => {
        setEditEntryId(entry.id);
        setEditText(entry.data.text);
        setEditTags(entry.data.tags);
        setNewEntry("");
        setSelectedTags([]);
    };

    const handleUpdateEntry = async () => {
        if (editText.length === 0) {
            setError("Entry cannot be empty.");
            return;
        }

        if (editTags.length !== 3) {
            setError("You must select exactly 3 tags.");
            return;
        }

        try {
            const response = await fetch(`/api/entries?userId=${userId}&entryId=${editEntryId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: editText, tags: editTags }),
            });

            if (response.ok) {
                const updatedEntry = await response.json();
                setEntries(entries.map(entry => entry.id === editEntryId ? updatedEntry : entry));
                setEditEntryId(null);
                setEditText("");
                setEditTags([]);
            } else {
                setError("Failed to update entry.");
            }
        } catch (err) {
            setError("Failed to update entry.");
        }
    };

    const filteredEntries = entries.filter(entry =>
        filterLabel ? entry.data.text.includes(filterLabel) || entry.data.tags.some((tag: string) => tag.includes(filterLabel)) : true
    );

    if (loading) {
        return <p>Loading entries...</p>;
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
                {/* New Entry Form */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Create New Entry</h2>
                    <textarea
                        value={editEntryId ? editText : newEntry}
                        onChange={(e) => { editEntryId ? setEditText(e.target.value) : setNewEntry(e.target.value); }}
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
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <span>{editEntryId ? editText.length : newEntry.length} / {editEntryId ? 1000 : 280}</span> {/* Unlimited text for new entry */}
                        <button
                            onClick={editEntryId ? handleUpdateEntry : handleNewEntrySubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            {editEntryId ? "Save" : "Submit"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                {/* Filter Entries by Tag or Text */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Filter Entries by Tag or Text</h2>
                    <input
                        type="text"
                        value={filterLabel}
                        onChange={(e) => setFilterLabel(e.target.value)}
                        placeholder="Enter text or tag to filter by"
                        className="p-2 border rounded-lg w-full"
                    />
                </div>

                {/* Display Entries */}
                <div>
                    <h2 className="text-xl font-semibold mb-2">Your Entries</h2>
                    <div className="space-y-4">
                        {filteredEntries.length === 0 ? (
                            <p>No entries found. Start creating some!</p>
                        ) : (
                            filteredEntries.map((entry: Entry) => (
                                <div key={entry.id} className="border p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-2">
                                        {new Date(entry.createdAt).toLocaleString()}
                                    </div>
                                    <div>
                                        <p>{entry.data.text}</p>
                                        <div className="mt-2">
                                            <strong>Tags:</strong>
                                            <div className="space-x-2 mt-2">
                                                {entry.data.tags.map((tag: string, index: number) => (
                                                    <span key={index} className="inline-block px-3 py-1 text-sm font-medium text-white rounded-full bg-black">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-4 space-x-4">
                                            <button onClick={() => handleEditEntry(entry)}>
                                                <FaPen className="text-blue-500" />
                                            </button>
                                            <button onClick={() => handleDeleteEntry(entry.id)}>
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
                {filteredEntries.length > 0 && (
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
