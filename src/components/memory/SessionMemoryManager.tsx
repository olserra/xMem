import React, { useState } from 'react';

const SessionMemoryManager: React.FC = () => {
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
            // For now, try to load by POSTing with sessionId only (could be improved with GET if supported)
            // We'll assume the backend will return the session memory if it exists
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });
            if (res.ok) {
                const data = await res.json();
                setMemory(JSON.stringify(data.memory || {}, null, 2));
                setLoadedSessionId(sessionId);
                setSuccess('Session loaded.');
            } else {
                setError('Failed to load session.');
            }
        } catch (e) {
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
            } else {
                setError('Failed to save session memory.');
            }
        } catch (e) {
            setError('Error saving session memory.');
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
            } else {
                setError('Failed to delete session.');
            }
        } catch (e) {
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
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
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
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
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