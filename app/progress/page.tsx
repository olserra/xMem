'use client';

import { useEffect, useState } from "react";
import { useUser } from "../Context";
import { AiFillDelete } from 'react-icons/ai';

interface Skill {
    id: string;             // This could be the user skill ID
    skillId: string;       // This is the skill ID from the available skills
    name: string;          // The name of the skill
    progress: number;      // The current progress of the skill
}

const ProgressPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]); // User's skills
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]); // Available skills
    const { userId } = useUser();

    useEffect(() => {
        const fetchUserSkills = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/progress?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user skills');
                }
                const data = await response.json();

                // Transform the fetched data
                const transformedSkills = data.map((item: any) => ({
                    id: item.id,                      // User skill ID
                    skillId: item.skill.id,           // The actual skill ID
                    name: item.skill.name,            // The name from the nested skill object
                    progress: item.currentProgress,    // currentProgress directly
                }));

                setSkills(transformedSkills);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserSkills();
    }, [userId]);


    useEffect(() => {
        const fetchAvailableSkills = async () => {
            try {
                const response = await fetch(`/api/skills`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'userId': userId
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch available skills');
                }

                const data = await response.json();

                // Ensure each skill has the necessary properties
                const filteredAvailableSkills = data.map((skill: any) => ({
                    id: skill.id,                  // ID of the skill
                    skillId: skill.id,             // Skill ID (make sure this is correct)
                    name: skill.name,              // Name of the skill
                    progress: 0                     // Default progress for available skills
                })).filter((skill: Skill) =>
                    !skills.some(userSkill => userSkill.skillId === skill.id) // Exclude already added skills
                );

                setAvailableSkills(filteredAvailableSkills);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAvailableSkills();
    }, [skills, userId]);



    const handleSkillClick = async (skill: Skill) => {
        console.log(skill, "Skill being saved"); // Debugging line
        const existingSkill = skills.find(s => s.skillId === skill.skillId); // Check if the skill is already added

        if (existingSkill) {
            return; // If the skill already exists for the user, do nothing
        }

        try {
            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skillId: skill.skillId, // Use skillId instead of id
                    currentProgress: 0,     // Initial progress set to 0
                    userId: userId,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save skill: ${response.status} ${errorText}`);
            }

            // Add the new skill to the user's skills
            const newSkill = { ...skill, progress: 0 }; // New skill object to be added

            setSkills((prev) => [...prev, newSkill]); // Update local state with the new skill

            // Remove the skill from availableSkills
            setAvailableSkills((prev) => prev.filter(s => s.skillId !== skill.skillId)); // Update availableSkills
        } catch (error) {
            console.error('Error saving skill:', error);
        }
    };

    const handleDeleteSkill = async (skillId: string) => {
        try {
            const response = await fetch(`/api/progress`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ progressId: skillId }), // Change to progressId
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete skill: ${response.status} ${errorText}`);
            }

            // Remove the skill from the local state
            setSkills((prev) => prev.filter(skill => skill.id !== skillId));
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    return (
        <div className="flex flex-col justify-center text-center gap-6 mx-8 md:mx-40">
            <h1 className="mt-10 text-2xl">Track Your Skills Progress</h1>

            {/* To be learned skills */}
            <div className="skills-container flex flex-col gap-4">
                {skills.map((skill) => (
                    <div key={skill.id} className="skill-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4">
                        <div className="flex-1">
                            <h2 className="text-lg">{skill.name}</h2>
                            <div className="progress-bar bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                            </div>
                        </div>
                        <p className="text-base text-center w-1/4">{skill.progress}%</p> {/* Display progress percentage directly */}
                        <div className="flex items-center">
                            <a
                                href={"https://chatgpt.com/g/g-kqRCHmM5H-openskills-online"}
                                target="_blank"
                                rel="noopener noreferrer" // Important for security reasons
                            >
                                <button className="ml-4 bg-blue-500 text-white rounded-lg px-4 py-2">Start</button>
                            </a>
                            <button
                                className="ml-2 text-grey-500"
                                onClick={() => handleDeleteSkill(skill.id)} // Function to handle skill deletion
                                title="Delete Skill"
                            >
                                <AiFillDelete size={24} /> {/* Render the delete icon */}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Clickable labels for adding skills from the API */}
            <div className="flex flex-wrap gap-2 mt-4">
                {availableSkills.map(skill => (
                    <button
                        key={skill.id}
                        className="border border-gray-400 rounded-lg p-2"
                        onClick={() => handleSkillClick(skill)}
                    >
                        {skill.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProgressPage;
