'use client';

import { useEffect, useState } from "react";
import { useUser } from "../Context";
import { AiFillDelete } from 'react-icons/ai';
import { FaRegCopy, FaCheck } from "react-icons/fa";

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

const handleCopyToClipboard = (userId: any, setCopied: (value: boolean) => void) => {
    navigator.clipboard.writeText(userId)
        .then(() => {
            console.log('User ID copied to clipboard:', userId);
            setCopied(true); // Set copied state to true

            // Reset copied state after 5 seconds
            setTimeout(() => setCopied(false), 5000);
        })
        .catch(err => {
            console.error('Failed to copy user ID:', err);
        });
};

const ProgressPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const { userId, userEmail } = useUser();
    const [loading, setLoading] = useState(true); // Loading state
    const [copied, setCopied] = useState(false); // State to track copy status

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
                                    href={"https://chatgpt.com/g/g-kqRCHmM5H-openskills"}
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

            <div className="flex justify-center items-center gap-2" onClick={() => handleCopyToClipboard(userId, setCopied)}>
                <span>Copy my user ID</span>
                {copied ? (
                    <div className="flex items-center">
                        <FaCheck className="text-green-500 p-1 border border-green-500 rounded-lg" size={24} />
                        <span className="text-green-500 ml-2">Copied</span>
                    </div>
                ) : (
                    <FaRegCopy className="text-gray-500 p-1 border border-gray-500 rounded-lg cursor-pointer" size={34} />
                )}
            </div>
        </div>
    );
};

export default ProgressPage;
