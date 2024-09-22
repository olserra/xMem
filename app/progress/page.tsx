'use client'

import { useEffect, useState } from "react";
import Link from 'next/link';
import { data } from "@/app/data/youtube";
import { useSession } from 'next-auth/react';

interface Skill {
    id: string;
    name: string;
    progress: number;
    status: string;
    category: string;
    slug: string;
}

const fetchUserId = async (email: string) => {
    const response = await fetch(`/api/user?email=${email}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user ID');
    }
    const data = await response.json();
    return data.id;
};

const ProgressPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const { data: session } = useSession();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            if (session?.user?.email) {
                try {
                    const id = await fetchUserId(session.user.email);
                    setUserId(id);
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                }
            }
        };

        getUserId();
    }, [session]);

    useEffect(() => {
        const fetchUserSkills = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/track-progress?userId=${userId}`);
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
            status: "To be learned",
            category: skillName.toLowerCase(),
            slug: skillName.toLowerCase().replace(/\s+/g, '-'),
        };

        try {
            console.log('User ID:', userId); // Log userId

            const response = await fetch('/api/progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    skillId: newSkill.id,
                    currentProgress: newSkill.progress,
                    status: newSkill.status,
                    user_id: userId,
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
            <h2 className="text-xl mt-6">To be Learned</h2>
            <div className="skills-container flex flex-col gap-4">
                {skills.filter(skill => skill.status === "To be learned").map((skill) => (
                    <div key={skill.id} className="skill-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4">
                        <div className="flex-1">
                            <h2 className="text-lg">{skill.name}</h2>
                            <div className="progress-bar bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div> {/* 0% progress */}
                            </div>
                        </div>
                        <p className="text-base text-center w-1/4">To be learned</p>
                        <Link href={`/${skill.category}/basic`}>
                            <button className="ml-4 bg-blue-500 text-white rounded-lg px-4 py-2">Start</button>
                        </Link>
                    </div>
                ))}
            </div>

            {/* In-progress skills */}
            <h2 className="text-xl mt-6">In Progress</h2>
            <div className="skills-container flex flex-col gap-4">
                {skills.filter(skill => skill.status === "In-progress").map((skill) => (
                    <div key={skill.id} className="skill-row flex items-center justify-between border border-1 border-gray-400 rounded-lg p-4">
                        <div className="flex-1">
                            <h2 className="text-lg">{skill.name}</h2>
                            <div className="progress-bar bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${skill.progress}%` }}></div> {/* Dynamic progress */}
                            </div>
                        </div>
                        <p className="text-base text-center w-1/4">In-progress</p>
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
