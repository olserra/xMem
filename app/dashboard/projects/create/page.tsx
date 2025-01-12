"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from '@/app/Context';

export default function CreateProject() {
    const { userId } = useUser();
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        memoryTemplate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Parse the memory template if provided
        let parsedMemoryTemplate = null;
        if (formData.memoryTemplate) {
            try {
                parsedMemoryTemplate = JSON.parse(formData.memoryTemplate);
            } catch (error) {
                console.error('Invalid JSON in memory template', error);
                return;
            }
        }

        // Send the data to the API to create the project
        const response = await fetch(`/api/projects?userId=${userId}`, {
            method: 'POST',
            body: JSON.stringify({
                name: formData.name,
                description: formData.description,
                memoryTemplate: parsedMemoryTemplate // Pass parsed memory template (or null)
            }),
            headers: {
                'Content-Type': 'application/json',
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
                // Handle non-JSON responses or empty responses
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

                    <div>
                        <label className="block text-sm font-medium mb-2">Memory Template (JSON) (Optional)</label>
                        <textarea
                            value={formData.memoryTemplate}
                            onChange={(e) => setFormData({ ...formData, memoryTemplate: e.target.value })}
                            className="w-full p-2 border rounded-lg font-mono"
                            rows={6}
                            placeholder='{
                                            "type": "memory",
                                            "content": "",
                                            "metadata": {}
                                        }'
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
