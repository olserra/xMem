'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '@/app/contexts/UserContext';

interface ApiKey {
    id: string;
    key: string;
    createdAt: string;
}
const ApiPage = () => {
    const { user } = useUser();
    const userId = user?.id;
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchApiKeys = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/api-key?userId=${userId}`);
                const data = await response.json();

                if (response.ok && data.apiKeys) {
                    setApiKeys(data.apiKeys);
                }
            } catch (error) {
                console.error('Error fetching API keys:', error);
            }
        };

        fetchApiKeys();
    }, [userId]);

    const generateApiKey = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await fetch('/api/api-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (response.ok) {
                setApiKeys(prev => [...prev, data.apiKey]);
                setIsCreating(false);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating API key:', error);
        }
    }, [userId]);

    const revokeApiKey = useCallback(async (keyId: string) => {
        if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch('/api/api-key', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyId }),
            });

            if (response.ok) {
                setApiKeys(prev => prev.filter(key => key.id !== keyId));
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error revoking API key:', error);
        }
    }, []);

    const toggleKeyVisibility = useCallback((keyId: string) => {
        setVisibleKeys(prev => ({
            ...prev,
            [keyId]: !prev[keyId]
        }));
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="flex flex-col max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">API Keys</h1>
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create New API Key
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="mb-6 p-4 border rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Create New API Key</h2>
                    <div className="flex gap-3">
                        <button
                            onClick={generateApiKey}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Generate
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="text-sm text-gray-500">Created: {formatDate(apiKey.createdAt)}</p>
                            </div>
                            <button
                                onClick={() => revokeApiKey(apiKey.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Revoke
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    type={visibleKeys[apiKey.id] ? 'text' : 'password'}
                                    value={apiKey.key}
                                    readOnly
                                    className="border border-gray-300 rounded-md p-2 w-full pr-10"
                                />
                                <button
                                    onClick={() => toggleKeyVisibility(apiKey.id)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    {visibleKeys[apiKey.id] ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {apiKeys.length === 0 && !isCreating && (
                    <div className="text-center py-8 text-gray-500">
                        No API keys yet. Click "Create New API Key" to get started.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiPage;