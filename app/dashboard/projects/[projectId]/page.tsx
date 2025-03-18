'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { FaSave, FaTimes } from 'react-icons/fa';
import { MdDelete, MdEdit } from "react-icons/md";
import { useUser } from '@/app/contexts/UserContext';

export default function ProjectPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useUser();
    const userId = user?.id;

    const [editedProject, setEditedProject] = useState<Partial<Project>>({
        name: '',
        description: '',
        visibility: 'private'
    });
    const [bearerToken, setBearerToken] = useState<string | null>(null);

    // Fetch Bearer Token
    useEffect(() => {
        const fetchBearerToken = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/bearer-token?userId=${userId}`);
                const data = await response.json();
                if (data.key) {
                    setBearerToken(data.key);
                } else {
                    console.error('Error fetching bearer token:', data.error);
                }
            } catch (error) {
                console.error('Error fetching bearer token:', error);
            }
        };

        fetchBearerToken();
    }, [userId]);

    // Fetch Project Data Once Bearer Token is Available
    useEffect(() => {
        if (!projectId || !bearerToken) return;

        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}?includeCount=true`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${bearerToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error("Failed to fetch project details");

                const data = await response.json();
                setProject(data);
                setEditedProject({
                    name: data.name,
                    description: data.description,
                    visibility: data.visibility
                });
            } catch (err) {
                setError('Error fetching project details');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, bearerToken]);

    // Handle Save (Update Project)
    const handleSave = async () => {
        if (!bearerToken) return;

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProject),
            });

            if (!response.ok) throw new Error('Failed to update project');

            const updatedProject = await response.json();
            setProject(updatedProject);
            setIsEditing(false);
        } catch (error) {
            setError('Error updating project');
        }
    };

    // Handle Delete Project
    const handleDelete = async () => {
        if (!bearerToken) return;
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${bearerToken}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete project');

            window.location.href = '/dashboard/projects';
        } catch (error) {
            setError('Error deleting project');
        }
    };

    // Loading State
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

    // Error State
    if (error) {
        return (
            <MaxWidthWrapper>
                <div className="py-6 max-w-4xl mx-auto">
                    <div className="text-center text-red-500">{error}</div>
                </div>
            </MaxWidthWrapper>
        );
    }

    return (
        <MaxWidthWrapper>
            <div className="py-6 max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1">
                            <h3 className="font-medium mb-2">Project Name</h3>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedProject.name}
                                    onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            ) : (
                                <p className="text-gray-600">{project?.name}</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {isEditing ? (
                                <div className='flex gap-2 mt-8 ml-4'>
                                    <button onClick={handleSave}><FaSave size={17} /></button>
                                    <button onClick={() => setIsEditing(false)}><FaTimes size={20} /></button>
                                </div>
                            ) : (
                                <div className='flex gap-2 mb-12'>
                                    <button onClick={() => setIsEditing(true)}><MdEdit size={20} /></button>
                                    <button onClick={handleDelete}><MdDelete size={20} /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">Description</h3>
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

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div>
                                <p className="font-medium">Created</p>
                                <p className='text-gray-600'>{new Date(project?.createdAt ?? '').toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-medium">Last Updated</p>
                                <p className='text-gray-600'>{new Date(project?.updatedAt ?? '').toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-medium">Type</p>
                                <p className='text-gray-600'>{project?.type ?? 'Not specified'}</p>
                            </div>
                            <div>
                                <p className="font-medium">Visibility</p>
                                <p className="text-gray-600 capitalize">{project?.visibility}</p>
                            </div>
                            <div>
                                <p className="font-medium">Memory Count</p>
                                <p className='text-gray-600'>{project?._count?.memories ?? 0} memories</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}