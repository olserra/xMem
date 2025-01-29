'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { FaRegCopy } from 'react-icons/fa';
import { useUser } from '../Context';

const ApiPage = () => {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
    const { userId } = useUser(); // Extract userId from the context

    const generateApiKey = async () => {
        if (!userId) {
            alert('User ID is required');
            return;
        }

        // Call the backend API to generate the API key, passing userId in the query parameters
        const response = await fetch(`/api/bearer-token?userId=${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            setApiKey(data.apiKey); // Set the returned API key to state
        } else {
            const error = await response.json();
            alert(`Error: ${error.error}`);
        }
    };

    const revokeApiKey = () => {
        // Logic to revoke the API key (for simplicity, just reset it here)
        setApiKey(null);
    };

    const copyToClipboard = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            alert('API Key copied to clipboard');
        }
    };

    const toggleApiKeyVisibility = () => {
        setIsApiKeyVisible(!isApiKeyVisible);
    };

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
