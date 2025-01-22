"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Plus } from 'lucide-react';
import { useUser } from '@/app/Context';

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
    const { userId } = useUser();

    useEffect(() => {
        const fetchProjects = async () => {
            if (!userId) return;

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
    }, [userId]);

    return (
        <MaxWidthWrapper>
            <div className="py-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold">Projects</h1>
                    <Link
                        href="/dashboard/projects/create"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                    >
                        <Plus size={20} />
                        <span>New Project</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.id}`}
                            className="border border-gray-300 bg-white rounded-lg p-4 hover:border-gray-400 transition-shadow"
                        >
                            <div className="flex flex-col h-full">
                                <h2 className="text-lg font-semibold mb-2">{project.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 flex-grow">{project.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{project.memoryCount} memories</span>
                                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
