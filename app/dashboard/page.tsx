"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaRegCopy, FaTrash, FaPen } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "../Context";

const Dashboard = () => {
    const { userId } = useUser();
    const { data: session, status } = useSession();
    const [newEntry, setNewEntry] = useState("");
    const [labels, setLabels] = useState<string[]>(["", "", ""]);
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [filterLabel, setFilterLabel] = useState<string>("");
    const [editEntryId, setEditEntryId] = useState<string | null>(null);
    const [editText, setEditText] = useState<string>("");
    const [editLabels, setEditLabels] = useState<string[]>(["", "", ""]);

    // Fetch user data (entries) from Prisma database
    useEffect(() => {
        if (!session || status !== "authenticated") return;

        const fetchEntries = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/entries?userId=${userId}`);
                const data = await response.json();

                if (Array.isArray(data)) {
                    setEntries(data);
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
    }, [session, status, userId]);

    // Handle copying all user data to clipboard
    const handleCopyToClipboard = () => {
        const allUserData = JSON.stringify(entries);  // Prepare all entries as JSON
        navigator.clipboard.writeText(allUserData)
            .then(() => {
                console.log('User data copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy user data:', err);
            });
    };

    // Handle new entry submission
    const handleNewEntrySubmit = async () => {
        if (newEntry.length > 280) {
            setError("Entry must be less than 280 characters.");
            return;
        }

        if (labels.some(label => label.trim() === "")) {
            setError("You must provide 3 labels.");
            return;
        }

        try {
            const response = await fetch(`/api/entries?userId=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: newEntry, labels }),
            });

            if (!response.ok) {
                throw new Error("Failed to create a new entry");
            }

            // Reset input fields after submitting
            setNewEntry(""); // Reset text input field
            setLabels(["", "", ""]); // Reset labels
            setError(null);  // Reset error state

            // Re-fetch entries after submitting
            const data = await response.json();
            if (Array.isArray(data)) {
                // Append the new entry to the existing entries
                setEntries(prevEntries => [...prevEntries, ...data]);
                window.location.reload();
            } else {
                setEntries([]);
                window.location.reload();
            }
        } catch (err) {
            setError("Failed to create a new entry.");
        }
    };


    // Handle deleting an entry
    const handleDeleteEntry = async (id: string) => {
        try {
            const response = await fetch(`/api/entries?userId=${userId}&entryId=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setEntries(entries.filter((entry) => entry.id !== id));
            } else {
                setError("Failed to delete entry.");
            }
        } catch (err) {
            setError("Failed to delete entry.");
        }
    };

    // Handle editing an entry
    const handleEditEntry = (entry: any) => {
        setEditEntryId(entry.id);
        setEditText(entry.data.text);
        setEditLabels(entry.data.labels);
        setNewEntry("");  // Clear new entry if editing
        setLabels(["", "", ""]);  // Clear the labels for new entry if editing
    };

    // Handle updating an entry
    const handleUpdateEntry = async () => {
        if (editText.length > 280) {
            setError("Entry must be less than 280 characters.");
            return;
        }

        if (editLabels.some(label => label.trim() === "")) {
            setError("You must provide 3 labels.");
            return;
        }

        try {
            const response = await fetch(`/api/entries?userId=${userId}&entryId=${editEntryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: editText, labels: editLabels }),
            });

            if (response.ok) {
                const updatedEntry = await response.json();
                setEntries(entries.map((entry) => entry.id === editEntryId ? updatedEntry : entry));
                setEditEntryId(null);
                setEditText("");
                setEditLabels(["", "", ""]);
            } else {
                setError("Failed to update entry.");
            }
        } catch (err) {
            setError("Failed to update entry.");
        }
    };

    // Handle canceling the edit
    const handleCancelEdit = () => {
        setEditEntryId(null);
        setEditText("");
        setEditLabels(["", "", ""]);
    };

    // Filter entries by label or text
    const filteredEntries = entries.filter(entry =>
        filterLabel ? entry.data.text.includes(filterLabel) || entry.data.labels.some((label: string) => label.includes(filterLabel)) : true
    );

    // Show loading spinner while fetching data
    if (loading) {
        return <p>Loading entries...</p>;
    }

    return (
        <MaxWidthWrapper>
            <div className="p-8">
                {/* New Entry Form */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Create New Entry</h2>
                    <textarea
                        value={editEntryId ? editText : newEntry}
                        onChange={(e) => {
                            editEntryId ? setEditText(e.target.value) : setNewEntry(e.target.value);
                        }}
                        placeholder="Enter your thoughts here..."
                        rows={5}
                        maxLength={280}
                        className="w-full p-3 border rounded-lg"
                    />
                    <div className="mt-4">
                        <h3 className="text-lg">Labels</h3>
                        <div className="flex space-x-2">
                            {(editEntryId ? editLabels : labels).map((label, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={label}
                                    onChange={(e) => {
                                        const updatedLabels = (editEntryId ? editLabels : labels).slice(); // Create a copy of the labels
                                        updatedLabels[index] = e.target.value;
                                        if (editEntryId) {
                                            setEditLabels(updatedLabels); // Update editLabels state
                                        } else {
                                            setLabels(updatedLabels); // Update labels state
                                        }
                                    }}
                                    placeholder={`Label ${index + 1}`}
                                    className="p-2 border rounded-lg w-full"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <span>{editEntryId ? editText.length : newEntry.length} / 280</span>
                        <button
                            onClick={editEntryId ? handleUpdateEntry : handleNewEntrySubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                        >
                            {editEntryId ? "Save" : "Submit"}
                        </button>
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>

                {/* Filter Entries by Label or Text */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Filter Entries by Label or Text</h2>
                    <input
                        type="text"
                        value={filterLabel}
                        onChange={(e) => setFilterLabel(e.target.value)}
                        placeholder="Enter text or label to filter by"
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
                            filteredEntries.map((entry: any) => (
                                <div key={entry.id} className="border p-4 rounded-lg">
                                    <div className="text-sm text-gray-500 mb-2">
                                        {new Date(entry.createdAt).toLocaleString()}
                                    </div>
                                    <div>
                                        <p>{entry.data.text}</p>
                                        <div className="mt-2">
                                            <strong>Labels:</strong> {entry.data.labels.join(', ')}
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
                            onClick={() => handleCopyToClipboard()}
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
