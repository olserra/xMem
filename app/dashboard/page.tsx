"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaRegCopy } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "../Context";

const Dashboard = () => {
  const { userId } = useUser();
  const { data: session, status } = useSession();  // useSession gives us session and status
  const [newEntry, setNewEntry] = useState("");
  const [labels, setLabels] = useState<string[]>(["", "", ""]);
  const [entries, setEntries] = useState<any[]>([]); // Ensure entries is always an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterLabel, setFilterLabel] = useState<string>("");

  // Handle adding labels
  const handleLabelChange = (index: number, value: string) => {
    const updatedLabels = [...labels];
    updatedLabels[index] = value;
    setLabels(updatedLabels);
  };

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

  // Fetch user data (entries) from Prisma database
  useEffect(() => {
    if (!session || status !== "authenticated") return; // Don't fetch until session is ready

    const fetchEntries = async () => {
      setLoading(true);
      try {
        // Pass userId in the query parameter for the GET request
        const response = await fetch(`/api/entries?userId=${userId}`);
        const data = await response.json();

        // Ensure that data is an array
        if (Array.isArray(data)) {
          setEntries(data);
        } else {
          setEntries([]); // Set an empty array if the response is not an array
        }
      } catch (err) {
        setError("Failed to fetch entries");
        setEntries([]); // Set an empty array if there is an error
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [session, status, userId]); // Add session, status, and userId as dependencies

  // Handle new entry submission
  const handleNewEntrySubmit = async () => {
    if (newEntry.length > 280) {
      setError("Entry must be less than 280 characters.");
      return;
    }

    // Ensure at least 3 labels
    if (labels.some(label => label.trim() === "")) {
      setError("You must provide 3 labels.");
      return;
    }

    try {
      // Pass userId in the body for the POST request
      const response = await fetch(`/api/entries?userId=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newEntry, labels }),  // Send entry text and labels as JSON
      });

      if (!response.ok) {
        throw new Error("Failed to create a new entry");
      }

      setNewEntry(""); // Reset input field
      setLabels(["", "", ""]); // Reset labels
      setError(null);  // Reset error
      // Re-fetch entries after submission
      const data = await response.json();
      if (Array.isArray(data)) {
        setEntries(data);  // Ensure the response is an array before setting state
      } else {
        setEntries([]); // In case of an invalid response
      }
    } catch (err) {
      setError("Failed to create a new entry.");
    }
  };

  // Filter entries by label
  const filteredEntries = entries.filter(entry =>
    filterLabel ? entry.data.labels.includes(filterLabel) : true
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
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Enter your thoughts here..."
            rows={5}
            maxLength={280}
            className="w-full p-3 border rounded-lg"
          />
          <div className="mt-4">
            <h3 className="text-lg">Labels</h3>
            <div className="flex space-x-2">
              {labels.map((label, index) => (
                <input
                  key={index}
                  type="text"
                  value={label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  placeholder={`Label ${index + 1}`}
                  className="p-2 border rounded-lg w-full"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span>{newEntry.length} / 280</span>
            <button
              onClick={handleNewEntrySubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Filter Entries by Label */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Filter Entries by Label</h2>
          <input
            type="text"
            value={filterLabel}
            onChange={(e) => setFilterLabel(e.target.value)}
            placeholder="Enter label to filter by"
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
                  <p>{entry.data.text}</p>
                  <div className="mt-2">
                    <strong>Labels:</strong> {entry.data.labels.join(', ')}
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
