'use client';

import { useEffect, useState } from "react";
import { useUser } from "../Context";
import { AiFillDelete } from 'react-icons/ai';
import { FaRegCopy } from "react-icons/fa";
import { handleSendEmail } from "../helpers/handleSendEmail";

interface Skill {
    id: string;
    skillId: string;
    name: string;
    progress: number;
}

const Skeleton: React.FC = () => (
    <div className="skill-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4 animate-pulse">
        <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="bg-gray-200 rounded-full h-2 mt-2 w-full"></div>
        </div>
    </div>
);

const handleCopyToClipboard = (userId: string) => {
    navigator.clipboard.writeText(userId)
        .then(() => {
            console.log('User ID copied to clipboard:', userId);
            // Optionally show a success message or toast notification
        })
        .catch(err => {
            console.error('Failed to copy user ID:', err);
        });
};


const ProgressPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
    const { userId, userEmail } = useUser();
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchUserSkills = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/progress?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user skills');
                }
                const data = await response.json();
                const transformedSkills = data.map((item: any) => ({
                    id: item.id,
                    skillId: item.skill.id,
                    name: item.skill.name,
                    progress: item.currentProgress,
                }));
                setSkills(transformedSkills);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Set loading to false after data fetching
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
                const filteredAvailableSkills = data.map((skill: any) => ({
                    id: skill.id,
                    skillId: skill.id,
                    name: skill.name,
                    progress: 0
                })).filter((skill: Skill) =>
                    !skills.some(userSkill => userSkill.skillId === skill.id)
                );

                setAvailableSkills(filteredAvailableSkills);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAvailableSkills();
    }, [skills, userId]);

    // const handleSkillClick = async (skill: Skill) => {
    //     const existingSkill = skills.find(s => s.skillId === skill.skillId);
    //     if (existingSkill) return;

    //     try {
    //         const response = await fetch('/api/progress', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 skillId: skill.skillId,
    //                 currentProgress: 0,
    //                 userId: userId,
    //             }),
    //         });

    //         if (!response.ok) {
    //             const errorText = await response.text();
    //             throw new Error(`Failed to save skill: ${response.status} ${errorText}`);
    //         }

    //         const newSkill = { ...skill, progress: 0 };
    //         setSkills((prev) => [...prev, newSkill]);
    //         setAvailableSkills((prev) => prev.filter(s => s.skillId !== skill.skillId));
    //     } catch (error) {
    //         console.error('Error saving skill:', error);
    //     }
    // };

    const handleDeleteSkill = async (skillId: string) => {
        try {
            const response = await fetch(`/api/progress`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ progressId: skillId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete skill: ${response.status} ${errorText}`);
            }

            setSkills((prev) => prev.filter(skill => skill.id !== skillId));
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    return (
        <div className="flex flex-col justify-center text-center gap-6 mx-8 md:mx-40">
            <h1 className="mt-10 text-2xl">Track Your Skills Progress</h1>

            <div className="skills-container flex flex-col gap-4">
                {loading ? (
                    // Render skeletons while loading
                    Array.from({ length: 1 }).map((_, index) => (
                        <Skeleton key={index} />
                    ))
                ) : (
                    skills.map((skill) => (
                        <div key={skill.id} className="skill-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4">
                            <div className="flex-1">
                                <h2 className="text-lg">{skill.name}</h2>
                                <div className="progress-bar bg-gray-200 rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div>
                                </div>
                            </div>
                            <p className="text-base text-center w-1/4">{skill.progress}%</p>
                            <div className="flex items-center">
                                <a
                                    href={"https://chatgpt.com/g/g-kqRCHmM5H-openskills-online"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button
                                        className="ml-4 text-black border border-gray-400 rounded-lg px-4 py-2 w-24" // Set a fixed width
                                    >
                                        {skill.progress > 0 ? 'Resume' : 'Start'}
                                    </button>

                                </a>
                                <button
                                    className="ml-2 text-grey-500"
                                    onClick={() => handleDeleteSkill(skill.id)}
                                    title="Delete Skill"
                                >
                                    <AiFillDelete size={24} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* <div className="flex flex-wrap gap-2 mt-4">
                {availableSkills.map(skill => (
                    <button
                        key={skill.id}
                        className="border border-gray-400 rounded-lg p-2"
                        onClick={() => handleSkillClick(skill)}
                    >
                        {skill.name}
                    </button>
                ))}
            </div> */}
            <div className="flex justify-center items-center gap-2" onClick={() => handleCopyToClipboard(userId)}>
                <span>Copy my user ID</span>
                <FaRegCopy className="text-gray-500 p-1 border border-gray-500 rounded-lg cursor-pointer" size={34} />
            </div>
        </div>
    );
};

export default ProgressPage;
