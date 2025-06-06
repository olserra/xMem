import React, { useEffect, useState } from 'react';
import { ExternalLink, X, Copy, Trash, Edit } from 'lucide-react';

interface SessionSummary {
    sessionId: string;
    createdAt: string;
    updatedAt: string;
    memory: Record<string, any>;
}

const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-teal-100 text-teal-800',
];

const SessionMemoryItemList: React.FC<{
    sessionId: string | null;
    refresh?: number;
    onSelectSession?: (id: string) => void;
    onDeleteSession?: (id: string) => void;
}> = ({ sessionId, refresh, onSelectSession, onDeleteSession }) => {
    const [memory, setMemory] = useState<any>(null);
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);
    const [copied, setCopied] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState<string>('');
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        setError(null);
        if (sessionId) {
            setLoading(true);
            fetch(`/api/sessions?sessionId=${encodeURIComponent(sessionId)}`)
                .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch session memory'))
                .then(data => setMemory(data.memory || {}))
                .catch(e => setError(typeof e === 'string' ? e : 'Error fetching session memory'))
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            fetch('/api/sessions')
                .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch sessions'))
                .then(data => setSessions(data.sessions || []))
                .catch(e => setError(typeof e === 'string' ? e : 'Error fetching sessions'))
                .finally(() => setLoading(false));
        }
    }, [sessionId, refresh]);

    const handleCopy = (session: SessionSummary) => {
        navigator.clipboard.writeText(JSON.stringify(session.memory, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const handleDelete = async (session: SessionSummary) => {
        setActionLoading(true);
        setDeleted(false);
        try {
            const res = await fetch('/api/sessions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: session.sessionId }),
            });
            if (res.ok) {
                setDeleted(true);
                setTimeout(() => {
                    setDeleted(false);
                    setModalOpen(false);
                    if (onDeleteSession) onDeleteSession(session.sessionId);
                }, 1200);
            } else {
                setDeleted(false);
                alert('Failed to delete session.');
            }
        } catch {
            setDeleted(false);
            alert('Failed to delete session.');
        }
        setActionLoading(false);
    };

    const handleEdit = (session: SessionSummary) => {
        setEditing(true);
        setEditValue(JSON.stringify(session.memory, null, 2));
        setSaveError(null);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditValue('');
        setSaveError(null);
    };

    const handleSaveEdit = async () => {
        if (!selectedSession) return;
        setSaveLoading(true);
        setSaveError(null);
        try {
            const parsed = JSON.parse(editValue);
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: selectedSession.sessionId, memory: parsed }),
            });
            if (res.ok) {
                setEditing(false);
                setEditValue('');
                setModalOpen(false);
                if (refresh !== undefined) window.location.reload(); // fallback refresh
            } else {
                setSaveError('Failed to save changes.');
            }
        } catch (e) {
            setSaveError('Invalid JSON or failed to save.');
        }
        setSaveLoading(false);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        if (editing) handleCancelEdit();
    };

    // Modal component
    const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-200/60">
                <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
                    <button
                        className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 text-xl cursor-pointer"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={22} />
                    </button>
                    {children}
                </div>
            </div>
        );
    };

    if (loading) return <div className="px-6 py-4 text-slate-400">Loading session memory...</div>;
    if (error) return <div className="px-6 py-4 text-rose-500">{error}</div>;

    if (!sessionId) {
        if (!sessions.length) return <div className="px-6 py-4 text-slate-400">No session memory found.</div>;
        // Table for md+ screens
        return (
            <div className="w-full">
                <Modal open={modalOpen} onClose={handleModalClose}>
                    {selectedSession && (
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Session Details</h2>
                            <div className="flex flex-row flex-wrap gap-2 mb-6 items-center justify-start">
                                <button
                                    className="flex items-center gap-1 px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm cursor-pointer"
                                    onClick={() => handleCopy(selectedSession)}
                                    disabled={copied}
                                    title="Copy Session Memory"
                                >
                                    <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                                    className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm cursor-pointer"
                                    onClick={() => handleEdit(selectedSession)}
                                    disabled={editing}
                                    title="Edit Session Memory"
                                >
                                    <Edit size={16} /> Edit
                                </button>
                                <button
                                    className="flex items-center gap-1 px-3 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm cursor-pointer"
                                    onClick={() => handleDelete(selectedSession)}
                                    disabled={actionLoading || deleted}
                                    title="Delete Session"
                                >
                                    <Trash size={16} /> {deleted ? 'Deleted!' : 'Delete'}
                                </button>
                            </div>
                            {editing ? (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium mb-1">Edit Session Memory (JSON)</label>
                                    <textarea
                                        className="w-full h-40 px-3 py-2 border border-slate-300 rounded font-mono text-xs"
                                        value={editValue}
                                        onChange={e => setEditValue(e.target.value)}
                                        disabled={saveLoading}
                                    />
                                    {saveError && <div className="text-red-600 text-xs mt-1">{saveError}</div>}
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50 cursor-pointer"
                                            onClick={handleSaveEdit}
                                            disabled={saveLoading}
                                        >
                                            {saveLoading ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="px-4 py-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 text-sm cursor-pointer"
                                            onClick={handleCancelEdit}
                                            disabled={saveLoading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4 bg-slate-50 rounded p-3 text-xs text-slate-700">
                                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(selectedSession.memory, null, 2)}</pre>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Session ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Updated</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Summary</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {sessions.map((s) => (
                                <tr key={s.sessionId} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 max-w-xs truncate">{s.sessionId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(s.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(s.updatedAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{JSON.stringify(s.memory).slice(0, 60)}{JSON.stringify(s.memory).length > 60 ? '…' : ''}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900 cursor-pointer mr-2"
                                            onClick={() => { setSelectedSession(s); setModalOpen(true); }}
                                            title="View Details"
                                        >
                                            <ExternalLink size={16} />
                                        </button>
                                        <button
                                            className="text-rose-600 hover:text-rose-800 cursor-pointer"
                                            onClick={() => handleDelete(s)}
                                            title="Delete Session"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Card layout for mobile */}
                <div className="md:hidden flex flex-col gap-3">
                    {sessions.map((s) => (
                        <div key={s.sessionId} className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 border border-slate-200">
                            <div className="font-semibold text-slate-800 text-sm mb-1">Session</div>
                            <div className="text-slate-700 text-xs break-words mb-2">{s.sessionId}</div>
                            <div className="flex flex-col gap-1 text-xs text-slate-500">
                                <span><span className="font-medium text-slate-700">Created:</span> {new Date(s.createdAt).toLocaleString()}</span>
                                <span><span className="font-medium text-slate-700">Updated:</span> {new Date(s.updatedAt).toLocaleString()}</span>
                                <span><span className="font-medium text-slate-700">Summary:</span> {JSON.stringify(s.memory).slice(0, 60)}{JSON.stringify(s.memory).length > 60 ? '…' : ''}</span>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                        onClick={() => { setSelectedSession(s); setModalOpen(true); }}
                                        title="View Details"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                    <button
                                        className="text-rose-600 hover:text-rose-800 cursor-pointer"
                                        onClick={() => handleDelete(s)}
                                        title="Delete Session"
                                    >
                                        <Trash size={16} />
                                    </button>
                                    <button
                                        className="text-slate-600 hover:text-slate-900 cursor-pointer"
                                        onClick={() => handleCopy(s)}
                                        title="Copy Session Memory"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Single session view
    if (!memory || Object.keys(memory).length === 0) return <div className="px-6 py-4 text-slate-400">No session memory found.</div>;
    return (
        <div className="overflow-x-auto px-6 py-4">
            <pre className="bg-slate-100 rounded p-4 text-xs text-slate-700 whitespace-pre-wrap">
                {JSON.stringify(memory, null, 2)}
            </pre>
        </div>
    );
};

export default SessionMemoryItemList;
