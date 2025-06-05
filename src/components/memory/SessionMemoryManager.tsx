import React, { useState } from 'react';

export interface SessionMemoryManagerProps {
    onSessionChange?: (sessionId: string | null) => void;
    onSessionMemorySaved?: () => void;
}

const SessionMemoryManager: React.FC<SessionMemoryManagerProps> = ({ onSessionChange, onSessionMemorySaved }) => {
    const [sessionId, setSessionId] = useState('');
    const [memory, setMemory] = useState('');
    const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleLoadSession = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            // Always send a memory field (empty object) to satisfy backend
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, memory: {} }),
            });
            if (res.ok) {
                const data = await res.json();
                setMemory(JSON.stringify(data.memory || {}, null, 2));
                setLoadedSessionId(sessionId);
                setSuccess('Session loaded.');
                if (onSessionChange) onSessionChange(sessionId);
            } else {
                setError('Failed to load session.');
            }
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
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: loadedSessionId, memory: JSON.parse(memory) }),
            });
            if (res.ok) {
                setSuccess('Session memory saved.');
                setLoadedSessionId(null); // Show the list after save
                if (onSessionMemorySaved) onSessionMemorySaved();
                setTimeout(() => setSuccess(null), 2000);
            } else {
                setError('Failed to save session memory.');
                if (onSessionMemorySaved) onSessionMemorySaved();
            }
        } catch {
            setError('Error saving session memory.');
            if (onSessionMemorySaved) onSessionMemorySaved();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!loadedSessionId) return;
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            const res = await fetch('/api/sessions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: loadedSessionId }),
            });
            if (res.ok) {
                setSuccess('Session deleted.');
                setLoadedSessionId(null);
                setMemory('');
                setSessionId('');
                if (onSessionChange) onSessionChange(null);
            } else {
                setError('Failed to delete session.');
            }
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
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Delete Session
                    </button>
                )}
            </div>
            {loadedSessionId && (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Session Memory (JSON)</label>
                    <textarea
                        className="w-full h-40 px-3 py-2 border border-slate-300 rounded font-mono text-sm"
                        value={memory}
                        onChange={e => setMemory(e.target.value)}
                        disabled={loading}
                    />
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