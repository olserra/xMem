"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from '@/app/Context';

export default function CreateProject() {
    const { userId } = useUser();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [bearerToken, setBearerToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchBearerToken = async () => {
            const response = await fetch(`/api/bearer-token?userId=${userId}`);
            const data = await response.json();
            if (data.key) {
                setBearerToken(data.key);
            } else {
                console.error('Error fetching bearer token:', data.error);
            }
        };

        if (userId) {
            fetchBearerToken();
        }
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bearerToken) {
            console.error('Bearer token is missing');
            return;
        }

        // Send the data to the API to create the project
        const response = await fetch(`/api/projects?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify({
                name: formData.name,
                description: formData.description,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${bearerToken}`,
            },
        });

        // Check if the response is a valid JSON
        if (response.ok) {
            try {
                const data = await response.json();
                if (data.id) {
                    // Redirect to the projects page after successful creation
                    router.push(`/dashboard/projects`);
                } else {
                    console.error('Error creating project', data.error);
                }
            } catch (error) {
                console.error('Failed to parse JSON response:', error);
            }
        } else {
            console.error('Failed to create project:', response.statusText);
        }
    };

    return (
        <MaxWidthWrapper>
            <div className="py-6 max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Create New Project</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Project Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                            required
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
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
                    >
                        Create Project
                    </button>
                </form>
            </div>
        </MaxWidthWrapper>
    );
}
