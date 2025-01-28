"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from '@/app/Context';
import { useSession } from 'next-auth/react'; // Import useSession hook
import { FaStar, FaRegStar } from 'react-icons/fa';

interface Project {
    id: string;
    name: string;
    description: string;
    updatedAt: string;
    _count: {
        memories: number;
    };
}

interface ProjectWithCount extends Project {
    memoryCount: number;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectWithCount[]>([]);
    const { userId, favorites, toggleFavorite } = useUser();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            window.location.href = "/";
        }
    }, [status]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!userId && session) return;

            try {
                const response = await fetch(`/api/projects?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                const projectsWithCounts = data.map((project: Project) => ({
                    ...project,
                    memoryCount: project._count.memories
                }));
                setProjects(projectsWithCounts);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [session, userId]);

    return (
        <MaxWidthWrapper>
            <div className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start">
                    {projects.map((project) => (
                        <div key={project.id} className="relative border border-gray-300 bg-white rounded-lg p-4">
                            <button
                                className="absolute top-5 right-6 cursor-pointer"
                                onClick={() => toggleFavorite(project.id)}
                            >
                                {favorites.includes(project.id) ? (
                                    <FaStar className="text-gray-700" />
                                ) : (
                                    <FaRegStar className="text-gray-400" />
                                )}
                            </button>
                            <div className="flex flex-col h-full">
                                <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 flex-grow">{project.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <p>{project.memoryCount ?? 0} memories</p>
                                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center mt-2 md:mt-4">
                    <Link
                        href="/dashboard/projects/create"
                        className="flex items-center text-sm gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                        <span>New Project</span>
                    </Link>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
