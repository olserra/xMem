import React, { useState } from 'react';

interface Video {
    id: number;
    title: string;
    url: string;
}

interface SearchBarProps {
    videos: Video[];
    onFilter: (filteredVideos: Video[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ videos, onFilter }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Handle search query change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);

        // Filter videos based on the search query
        const filtered = videos.filter(video =>
            video.title.toLowerCase().includes(query.toLowerCase())
        );
        onFilter(filtered);
    };

    return (
        <div className="w-full max-w-md mx-auto my-4">
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search videos..."
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
            />
        </div>
    );
};

export default SearchBar;
