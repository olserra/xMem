'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FaRegCopy } from "react-icons/fa";
import { useUser } from '../Context';
import { v4 as uuidv4 } from 'uuid';

const ApiPage = () => {
    const { userId } = useUser();
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

    useEffect(() => {
        const fetchApiKey = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/api-key?userId=${userId}`);
                const data = await response.json();

                if (response.ok && data.apiKey) {
                    setApiKey(data.apiKey);
                } else {
                    setApiKey(null);
                }
            } catch (error) {
                console.error('Error fetching API key:', error);
            }
        };

        fetchApiKey();
    }, [userId]);

    const generateApiKey = useCallback(async () => {
        if (!userId) return;

        const newApiKey = uuidv4();
        try {
            const response = await fetch('/api/api-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, apiKey: newApiKey }),
            });

            const data = await response.json();

            if (response.ok) {
                setApiKey(newApiKey);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error creating API key:', error);
        }
    }, [userId]);

    const revokeApiKey = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await fetch('/api/api-key', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();

            if (response.ok) {
                setApiKey(null);
            } else {
                console.error('Error deleting API key:', data.error);
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error deleting API key:', error);
        }
    }, [userId]);

    const copyToClipboard = useCallback(() => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            alert('API Key copied to clipboard');
        }
    }, [apiKey]);

    const toggleApiKeyVisibility = useCallback(() => {
        setIsApiKeyVisible((prev) => !prev);
    }, []);

    return (
        <div className="flex flex-col max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">API Management</h1>
            {apiKey ? (
                <div>
                    <p className="mb-2">Your API Key:</p>
                    <div className="flex items-center mb-4 gap-2">
                        <div className="relative flex-1">
                            <input
                                type={isApiKeyVisible ? 'text' : 'password'}
                                value={apiKey}
                                readOnly
                                className="border border-gray-300 rounded-md p-2 w-full h-10 pr-10"
                                style={{ minWidth: '500px' }}
                            />
                            <button
                                onClick={toggleApiKeyVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {isApiKeyVisible ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className="border p-2 border-gray-300 rounded-md h-10 w-10 flex items-center justify-center"
                        >
                            <FaRegCopy className="text-black" size={15} />
                        </button>
                        <button
                            onClick={revokeApiKey}
                            className="text-md border p-2 border-gray-300 rounded-md h-10 flex items-center justify-center"
                        >
                            Revoke
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={generateApiKey}
                    className="border p-2 border-gray-300 rounded-md h-10"
                >
                    Generate API Key
                </button>
            )}
        </div>
    );
};

export default ApiPage;