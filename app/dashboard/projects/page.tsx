"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from '@/app/Context';
import { useSession } from 'next-auth/react';
import { FaStar, FaRegStar, FaTrash } from 'react-icons/fa';

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
    const { userId, favorites, filterLabel, toggleFavorite } = useUser();
    const { data: session, status } = useSession();
    const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

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

    // Apply the filter using the filterLabel from context
    const filteredProjects = useMemo(() => {
        return projects.filter(project =>
            filterLabel ? project.name.toLowerCase().includes(filterLabel.toLowerCase()) || project.description.toLowerCase().includes(filterLabel.toLowerCase()) : true
        );
    }, [projects, filterLabel]);

    const toggleSelection = useCallback((id: string) => {
        setSelectedProjects(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedProjects.size === filteredProjects.length) {
            setSelectedProjects(new Set());
        } else {
            setSelectedProjects(new Set(filteredProjects.map((project) => project.id)));
        }
    }, [filteredProjects, selectedProjects]);

    const handleDeleteSelectedProjects = useCallback(async () => {
        try {
            const deletePromises = Array.from(selectedProjects).map((id) =>
                fetch(`/api/projects/${id}?userId=${userId}`, { method: "DELETE" })
            );
            const responses = await Promise.all(deletePromises);

            if (responses.every((response) => response.ok)) {
                setProjects(projects.filter((p) => !selectedProjects.has(p.id)));
                setSelectedProjects(new Set()); // Clear the selected projects after deleting
            }
        } catch (err) {
            console.error("Failed to delete selected projects.");
        }
    }, [projects, selectedProjects, userId]);

    return (
        <MaxWidthWrapper>
            <div className="py-6">
                <div className="mb-6 flex justify-start items-center gap-4">
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <div className="flex gap-4 items-center">
                        <button
                            className="text-black py-2 px-3 rounded-lg"
                            onClick={toggleSelectAll}
                        >
                            {selectedProjects.size === filteredProjects.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <Link
                            href="/dashboard/projects/create"
                        >
                            <span>New Project</span>
                        </Link>
                        {selectedProjects.size > 0 && (
                            <button
                                className="text-black py-2 px-3 rounded-lg"
                                onClick={handleDeleteSelectedProjects}
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-start">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="relative border border-gray-300 bg-white rounded-lg p-4">
                            <input
                                type="checkbox"
                                checked={selectedProjects.has(project.id)}
                                onChange={() => toggleSelection(project.id)}
                                className="absolute top-6 left-4"
                            />
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
                                <h2 className="text-lg font-semibold mb-2 ml-6">{project.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 flex-grow">{project.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <p>{project.memoryCount ?? 0} memories</p>
                                    <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
