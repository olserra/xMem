'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { MdDelete, MdEdit } from "react-icons/md";


interface Project {
    id: string;
    name: string;
    description: string;
    type?: string;
    visibility: string;
    createdAt: string;
    updatedAt: string;
    memories: Memory[];
    _count: {
        memories: number;
    };
}

interface Memory {
    id: string;
    content: string;
    type: string;
    createdAt: string;
}

export default function ProjectPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState<Partial<Project>>({
        name: '',
        description: '',
        visibility: 'private'
    });

    useEffect(() => {
        if (projectId) {
            setLoading(true);
            fetch(`/api/projects/${projectId}?includeCount=true`)  // Pass a query param to include count
                .then((response) => response.json())
                .then((data) => {
                    console.log(data); // Debug to verify if _count is included
                    setProject(data);
                    setEditedProject({
                        name: data.name,
                        description: data.description,
                        visibility: data.visibility
                    });
                    setLoading(false);
                })
                .catch((error) => {
                    setError('Error fetching project details');
                    setLoading(false);
                });
        }
    }, [projectId]);


    const handleSave = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProject),
            });

            if (response.ok) {
                const updatedProject = await response.json();
                setProject(updatedProject);
                setIsEditing(false);
            } else {
                setError('Failed to update project');
            }
        } catch (error) {
            setError('Error updating project');
        }
    };

    if (loading) {
        return (
            <MaxWidthWrapper>
                <div className="py-6 max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                </div>
            </MaxWidthWrapper>
        );
    }

    if (error) {
        return (
            <MaxWidthWrapper>
                <div className="py-6 max-w-4xl mx-auto">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </MaxWidthWrapper>
        );
    }

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`/api/projects/${projectId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Redirect to the projects list or another appropriate page
                    window.location.href = '/dashboard/projects';
                } else {
                    setError('Failed to delete project');
                }
            } catch (error) {
                setError('Error deleting project');
            }
        }
    };

    return (
        <MaxWidthWrapper>
            <div className="py-6 max-w-4xl mx-auto">
                {/* Project Header */}

                {/* Project Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-medium mb-2">Project Name</h3>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedProject.name}
                                    onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                                    className="text-lg w-full p-2 border rounded"
                                />
                            ) : (
                                <h1 className="text-lg text-gray-600">{project?.name}</h1>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <div className='flex gap-2 mt-8 ml-4'>
                                    <button
                                        onClick={handleSave}
                                    >
                                        <FaSave size={17} />
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                    >
                                        <FaTimes size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className='flex gap-2 mb-12'>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <MdEdit size={20} />
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                    >
                                        <MdDelete size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-medium mb-2">Description</h3>
                            {isEditing ? (
                                <textarea
                                    value={editedProject.description}
                                    onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    rows={4}
                                />
                            ) : (
                                <p className="text-gray-600">{project?.description}</p>
                            )}
                        </div>

                        {isEditing && (
                            <div>
                                <h3 className="text-lg font-medium mb-2">Visibility</h3>
                                <select
                                    value={editedProject.visibility}
                                    onChange={(e) => setEditedProject({ ...editedProject, visibility: e.target.value })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="private">Private</option>
                                    <option value="public">Public</option>
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <h4 className="text-lg font-medium">Created</h4>
                                <p className='text-gray-600'>{new Date(project?.createdAt || '').toLocaleString()}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium">Last Updated</h4>
                                <p className='text-gray-600'>{new Date(project?.updatedAt || '').toLocaleString()}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium">Type</h4>
                                <p className='text-gray-600'>{project?.type || 'Not specified'}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium">Visibility</h4>
                                <p className="text-gray-600 capitalize">{project?.visibility}</p>
                            </div>
                            <div>
                                <h4 className="text-lg font-medium">Memory Count</h4>
                                <p className='text-gray-600'>{project?._count?.memories ?? 0} memories</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>

    );
}
