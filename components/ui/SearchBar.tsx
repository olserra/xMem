import React, { useState } from 'react';

interface Video {
	id: number;
	title: string;
	url: string;
}

interface Skill {
	title: string;
	description: string;
	icon: JSX.Element;
	category: string;
}

interface SearchBarProps {
	videos?: Video[];
	skills?: Skill[];
	onFilterVideos?: (filteredVideos: Video[]) => void;
	onFilterSkills?: (filteredSkills: Skill[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ videos = [], skills = [], onFilterVideos, onFilterSkills }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchQuery(query);

		// Filter videos based on the search query
		const filteredVideos = videos.filter(video =>
			video.title.toLowerCase().includes(query.toLowerCase())
		);
		if (onFilterVideos) {
			onFilterVideos(filteredVideos);
		}

		// Filter skills based on the search query
		const filteredSkills = skills.filter(skill =>
			skill.title.toLowerCase().includes(query.toLowerCase())
		);
		if (onFilterSkills) {
			onFilterSkills(filteredSkills);
		}
	};

	return (
		<div className="w-full max-w-md mx-auto my-4">
			<input
				type="text"
				value={searchQuery}
				onChange={handleSearchChange}
				placeholder="Search..."
				className="w-full p-2 pl-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
			/>
		</div>
	);
};

export default SearchBar;
