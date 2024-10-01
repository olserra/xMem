import React, { useState } from 'react';

// Define the Skill interface as before
interface Skill {
	title: string;
	description: string;
	category?: string; // Optional if you decide not to include it
	labels: string[];
	children?: Skill[];
}

interface SearchBarProps {
	skills: Skill[];
	onFilterSkills: (skills: Skill[]) => void; // Type for the function prop
}

const SearchBar: React.FC<SearchBarProps> = ({ skills = [], onFilterSkills }) => {
	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value;
		setSearchQuery(query);

		// Filter skills based on the search query
		const filterSkillsRecursive = (skillList: Skill[]): Skill[] => {
			return skillList
				.map((skill) => {
					const matches = skill.title.toLowerCase().includes(query.toLowerCase());
					const filteredChildren = skill.children ? filterSkillsRecursive(skill.children) : [];
					const hasMatchingChildren = filteredChildren.length > 0;

					// Return the skill if it matches or if it has matching children
					if (matches || hasMatchingChildren) {
						return { ...skill, children: filteredChildren };
					}
					return null;
				})
				.filter(Boolean) as Skill[]; // Filter out null values
		};

		const filteredSkills = filterSkillsRecursive(skills);
		if (onFilterSkills) {
			onFilterSkills(filteredSkills);
		}
	};

	return (
		<div className="w-full max-w-sm md:max-w-xl mx-auto mt-4">
			<input
				type="text"
				value={searchQuery}
				onChange={handleSearchChange}
				placeholder="Search skills..."
				className="w-full p-3 md:pl-4 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:border-blue-500"
			/>
		</div>
	);
};

export default SearchBar;
