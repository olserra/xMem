import React, { useState, useEffect } from 'react';

export interface SessionMemoryManagerProps {
    onSessionChange?: (sessionId: string | null) => void;
    onSessionMemorySaved?: () => void;
}

const messageExample = "Always call me 'John'.";

const SessionMemoryManager: React.FC<SessionMemoryManagerProps> = ({ onSessionChange, onSessionMemorySaved }) => {
    const [sessionId, setSessionId] = useState('');
    const [jsonValue, setJsonValue] = useState('');
    const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleLoadSession = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            setLoadedSessionId(sessionId);
            setSuccess('Session loaded.');
            setTimeout(() => setSuccess(null), 3000);
            if (onSessionChange) onSessionChange(sessionId);
        } catch {
            setError('Error loading session.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const message = jsonValue.trim();
            if (!message) throw new Error('Message cannot be empty');
            await fetch('/api/session-memory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: loadedSessionId, content: message, role: 'user', messageExampleContent: messageExample }),
            });
            setSuccess('Session memory saved.');
            if (onSessionMemorySaved) onSessionMemorySaved();
            setTimeout(() => setSuccess(null), 3000);
            setLoadedSessionId(null);
            setJsonValue('');
            setSessionId('');
        } catch (e) {
            setError('Message cannot be empty or failed to save.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSession = async () => {
        if (!loadedSessionId) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await fetch('/api/session-memory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: loadedSessionId }),
            });
            setSuccess('Session deleted.');
            setTimeout(() => setSuccess(null), 3000);
            setLoadedSessionId(null);
            setJsonValue('');
            setSessionId('');
            if (onSessionChange) onSessionChange(null);
        } catch {
            setError('Error deleting session.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 text-slate-600">
            <h2 className="text-xl font-semibold mb-4">Session Memory Manager</h2>
            <div className="mb-4 flex gap-2 items-end">
                <div>
                    <label className="block text-sm font-medium mb-1">Session ID</label>
                    <input
                        type="text"
                        className="px-3 py-2 border border-slate-300 rounded w-48"
                        value={sessionId}
                        onChange={e => setSessionId(e.target.value)}
                        disabled={!!loadedSessionId}
                        placeholder="Enter or create session ID"
                    />
                </div>
                <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
                    onClick={handleLoadSession}
                    disabled={loading || !sessionId || !!loadedSessionId}
                >
                    Load/Create
                </button>
                {loadedSessionId && (
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        onClick={handleDeleteSession}
                        disabled={loading}
                    >
                        Delete Session
                    </button>
                )}
            </div>
            {loadedSessionId && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Message</label>
                    <textarea
                        className="w-full h-40 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                        value={jsonValue}
                        onChange={e => setJsonValue(e.target.value)}
                        disabled={loading}
                        placeholder={messageExample}
                    />
                    <div className="text-xs text-slate-500 mt-1">
                        Enter a message (e.g., <code>Always call me John.</code>) for this session.
                    </div>
                    <button
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        Save
                    </button>
                </div>
            )}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
        </div>
    );
};

export default SessionMemoryManager;