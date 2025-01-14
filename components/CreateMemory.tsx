"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useUser } from "@/app/Context";

interface Project {
    id: string;
    name: string;
    description: string;
    type?: string;
    visibility: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    memories?: Memory[];
}

interface Memory {
    id: string;
    content: string;
    type: string;
    tags: string[];
    metadata?: any;
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateMemoryForm {
    content: string;
    tags: string[];
    projectId?: string;
}

function useWindowSize() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 640);
        }

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}

export default function CreateMemory() {
    const { userId } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialProjectId = searchParams.get('projectId');
    const isMobile = useWindowSize();

    const [formData, setFormData] = useState<CreateMemoryForm>({
        content: "",
        tags: [],
        projectId: initialProjectId || undefined
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const availableTags = [
        "Personal Facts", "Preferences", "Work History", "Hobbies", "Education",
        "Skills", "Goals", "Challenges", "Achievements", "Important Dates",
        "Insights", "Experiences", "Health", "Technology", "Mindset",
        "Creativity", "Productivity", "Learning", "Well-being", "Motivation",
    ];

    useEffect(() => {
        const id = searchParams.get('id');
        const content = searchParams.get('content');
        const tags = searchParams.get('tags')?.split(",") || [];
        const projectId = searchParams.get('projectId');

        if (id && content) {
            setFormData({
                content,
                tags,
                projectId: projectId || undefined  // Ensure projectId is properly set
            });
        }
    }, [searchParams]);


    const memoryId = searchParams.get('id');
    const isEditing = Boolean(memoryId);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`/api/projects?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        if (userId) fetchProjects();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!userId) {
            setError("User ID is required. Please ensure you're logged in.");
            setLoading(false);
            return;
        }

        if (formData.tags.length !== 3) {
            setError("Please select exactly 3 tags");
            setLoading(false);
            return;
        }

        const memoryId = searchParams.get('id');
        const isEditing = Boolean(memoryId);

        try {
            const response = await fetch(isEditing ? `/api/memory/${memoryId}` : '/api/memory', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: formData.content,
                    tags: formData.tags,
                    type: "note",
                    metadata: {},
                    projectId: formData.projectId !== undefined ? formData.projectId : null,  // Explicitly handle null
                    userId: userId,
                    isArchived: false,
                    version: 1
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || (isEditing ? 'Failed to update memory' : 'Failed to create memory'));
            }

            // Redirect after saving
            router.push('/dashboard/memories');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save memory. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTagToggle = (tag: string) => {
        setFormData(prev => {
            if (prev.tags.includes(tag)) {
                return { ...prev, tags: prev.tags.filter(t => t !== tag) };
            }
            if (prev.tags.length < 3) {
                return { ...prev, tags: [...prev.tags, tag] };
            }
            return prev;
        });
    };

    return (
        <MaxWidthWrapper>
            <div className="max-w-4xl mx-auto py-4 px-4 sm:py-8 sm:px-6">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">Create New Memory</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-2">
                            Capture your thoughts, insights, and experiences
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
                            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Project Association (Optional)</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, projectId: undefined }))}
                                    className={`p-2 sm:p-3 rounded-lg border-2 text-left transition-all ${!formData.projectId
                                        ? 'border-black bg-gray-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="block font-medium text-sm sm:text-base">No Project</span>
                                    <span className="text-xs sm:text-sm text-gray-500">Standalone memory</span>
                                </button>
                                {projects.map(project => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, projectId: project.id }))}
                                        className={`p-2 sm:p-3 rounded-lg border-2 text-left transition-all ${formData.projectId === project.id
                                            ? 'border-black bg-gray-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex flex-col h-full overflow-hidden">
                                            <span className="block font-medium text-sm sm:text-base truncate">
                                                {project.name}
                                            </span>
                                            <span className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                                                {isMobile
                                                    ? `${project.description.slice(0, 40)}...`
                                                    : project.description
                                                }
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
                            <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Memory Content</h2>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="What's on your mind?"
                                rows={5}
                                className="w-full p-2 sm:p-3 border rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent text-sm sm:text-base"
                                required
                            />
                        </div>

                        <div className="bg-white p-4 sm:p-6 rounded-lg border shadow-sm">
                            <div className="flex justify-between items-center mb-3 sm:mb-4">
                                <h2 className="text-base sm:text-lg font-medium">Select Tags (3)</h2>
                                <span className="text-xs sm:text-sm text-gray-500">
                                    {formData.tags.length}/3 selected
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {availableTags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleTagToggle(tag)}
                                        className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${formData.tags.includes(tag)
                                            ? 'bg-black text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs sm:text-sm">{error}</div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save' : 'Create Memory')}
                        </button>

                    </form>
                </div>
            </div>
        </MaxWidthWrapper>
    );
}
