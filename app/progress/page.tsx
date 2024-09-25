'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { data } from "@/app/data/youtube";
import { useUser } from "../Context";

interface Skill {
    id: string;
    name: string;
    progress: number;
    category: string;
    slug: string;
}

const ProgressPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const { userId } = useUser();

    useEffect(() => {
        const fetchUserSkills = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/progress?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch skills');
                }
                const data = await response.json();
                setSkills(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserSkills();
    }, [userId]);

    const handleSkillClick = async (skillName: string) => {
        const existingSkill = skills.find(skill => skill.name === skillName);

        if (existingSkill) {
            return;
        }

        const newSkill: Skill = {
            id: skillName.toLowerCase(),
            name: skillName,
            progress: 0,
            category: skillName.toLowerCase(),
            slug: skillName.toLowerCase().replace(/\s+/g, '-'),
        };

        try {
            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skillId: newSkill.id,  // Correct field name
                    currentProgress: newSkill.progress,
                    userId: userId,  // Change from user_id to userId
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save skill: ${response.status} ${errorText}`);
            }

            setSkills((prev) => [...prev, newSkill]); // Update local state with the new skill
        } catch (error) {
            console.error('Error saving skill:', error);
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
                        {skill.progress === 0 ? (
                            <p className="text-base text-center w-1/4">To be learned</p>
                        ) : skill.progress < 100 ? (
                            <p className="text-base text-center w-1/4">In Progress</p>
                        ) : (
                            <p className="text-base text-center w-1/4">Done</p>
                        )}
                        <Link href={`/${skill.category}/basic`}>
                            <button className="ml-4 bg-blue-500 text-white rounded-lg px-4 py-2">Start</button>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Clickable labels for adding skills */}
            <div className="flex flex-wrap gap-2 mt-4">
                {Object.entries(data).map(([skillKey, roadmap]) => (
                    <button
                        key={skillKey}
                        className="border border-gray-400 rounded-lg p-2"
                        onClick={() => handleSkillClick(skillKey)}
                    >
                        {roadmap.basic.title} {/* Displaying the title here */}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProgressPage;
