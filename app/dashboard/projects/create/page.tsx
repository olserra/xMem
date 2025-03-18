"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MaxWidthWrapper from "@/app/components/MaxWidthWrapper";
import { useUser } from '@/app/contexts/UserContext';

export default function CreateProject() {
    const { user } = useUser();
    const userId = user?.id;
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!userId) {
            setError('You must be logged in to create a project.');
            setIsLoading(false);
            return;
        }

        try {
            // Send the data to the API to create the project
            const response = await fetch(`/api/projects`, {
                method: 'POST',
                body: JSON.stringify({
                    name: formData.name,
                    description: formData.description,
                    userId: userId
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok && data.id) {
                // Redirect to the projects page after successful creation
                router.push(`/dashboard/projects`);
            } else {
                setError(data.error || 'Failed to create project. Please try again.');
                console.error('Error creating project:', data.error);
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Failed to create project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MaxWidthWrapper>
            <div className="py-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Create New Project</h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            rows={4}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Project...' : 'Create Project'}
                    </button>
                </form>
            </div>
        </MaxWidthWrapper>
    );
}
