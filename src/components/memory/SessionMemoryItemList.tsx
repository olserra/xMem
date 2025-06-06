import { Copy, Edit, ExternalLink, Trash, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SessionMessage {
    id: string;
    role: string;
    content: string;
    pinned: boolean;
    deleted: boolean;
    createdAt: string;
}

interface SessionSummary {
    sessionId: string;
    message?: string;
    updatedAt?: string;
}

interface Props {
    sessionId: string | null;
    refresh?: number;
    onSelectSession?: (id: string | null) => void;
    onDeleteSession?: (id: string) => void;
}

const SessionMemoryItemList: React.FC<Props> = ({
    sessionId,
    refresh = 0,
    onSelectSession,
    onDeleteSession,
}) => {
    const [messages, setMessages] = useState<SessionMessage[]>([]);
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(
        null
    );
    const [copied, setCopied] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        setError(null);
        if (sessionId) {
            setLoading(true);
            fetch(`/api/session-memory?sessionId=${encodeURIComponent(sessionId)}`)
                .then((res) =>
                    res.ok
                        ? res.json()
                        : Promise.reject("Failed to fetch session messages")
                )
                .then((data) => {
                    setMessages(data.messages || []);
                })
                .catch((e) =>
                    setError(
                        typeof e === "string" ? e : "Error fetching session messages"
                    )
                )
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            fetch("/api/session-memory")
                .then((res) =>
                    res.ok ? res.json() : Promise.reject("Failed to fetch sessions")
                )
                .then(async (data) => {
                    let sessionsWithMessage = await Promise.all(
                        (data.sessions || []).map(async (session: any) => {
                            // Fetch first message for this session
                            const res = await fetch(
                                `/api/session-memory?sessionId=${encodeURIComponent(
                                    session.sessionId
                                )}`
                            );
                            if (res.ok) {
                                const sessionData = await res.json();
                                const msgs = sessionData.messages || [];
                                return {
                                    ...session,
                                    message: msgs.length
                                        ? msgs[msgs.length - 1].content
                                        : undefined,
                                };
                            }
                            return { ...session };
                        })
                    );
                    setSessions(sessionsWithMessage);
                })
                .catch((e) =>
                    setError(typeof e === "string" ? e : "Error fetching sessions")
                )
                .finally(() => setLoading(false));
        }
    }, [sessionId, refresh]);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(messages, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const handleDeleteSession = async () => {
        if (!selectedSession) return;

        setActionLoading(true);
        setDeleted(false);

        try {
            const res = await fetch("/api/session-memory", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: selectedSession.sessionId }),
            });

            if (!res.ok) {
                throw new Error("Failed to delete session");
            }

            setDeleted(true);
            setSessions((prevSessions) =>
                prevSessions.filter((s) => s.sessionId !== selectedSession.sessionId)
            );

            setTimeout(() => {
                setDeleted(false);
                setModalOpen(false);
                onDeleteSession?.(selectedSession.sessionId);
            }, 1000);
        } catch (err) {
            setDeleted(false);
            setError(
                err instanceof Error ? err.message : "Failed to delete session"
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    // Modal component
    const Modal: React.FC<{
        open: boolean;
        onClose: () => void;
        children: React.ReactNode;
    }> = ({ open, onClose, children }) => {
        if (!open) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
                <div
                    className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative border border-slate-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {/* Modal always mounted, only visible when modalOpen is true */}
            <Modal open={modalOpen} onClose={handleModalClose}>
                {selectedSession && (
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Session Details</h2>
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="text-sm text-slate-500 mb-1">Session ID</div>
                                <div className="font-mono text-sm">
                                    {selectedSession.sessionId}
                                </div>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="text-sm text-slate-500 mb-2">Message</div>
                                <div className="text-sm whitespace-pre-wrap">
                                    {selectedSession.message || (
                                        <span className="text-slate-400 italic">No message</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-4 border-t">
                                <button
                                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm"
                                    onClick={handleCopy}
                                    disabled={copied}
                                    title="Copy Session Messages"
                                >
                                    <Copy size={14} /> {copied ? "Copied!" : "Copy Messages"}
                                </button>
                                <button
                                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-sm"
                                    onClick={handleDeleteSession}
                                    disabled={actionLoading || deleted}
                                    title="Delete Session"
                                >
                                    <Trash size={14} /> {deleted ? "Deleted!" : "Delete Session"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
            {/* Table and rest of UI */}
            {!sessionId || sessionId === "" ? (
                !sessions.length ? (
                    <div className="px-6 py-4 text-slate-400">
                        No session memory found.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                                    Session ID
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                                    Message
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                                    Updated
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {sessions.map((session) => (
                                <tr key={session.sessionId}>
                                    <td className="px-4 py-2 font-mono text-xs">
                                        {session.sessionId}
                                    </td>
                                    <td className="px-4 py-2 text-xs truncate max-w-xs">
                                        {session.message || (
                                            <span className="text-slate-300">(none)</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-xs">
                                        {session.updatedAt
                                            ? new Date(session.updatedAt).toLocaleString()
                                            : ""}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="p-2 rounded hover:bg-slate-100 text-slate-600 cursor-pointer"
                                            onClick={() => {
                                                setSelectedSession(session);
                                                setModalOpen(true);
                                            }}
                                            title="View Details"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            ) : null}
            {/* Only show 'Session Messages' when a session is selected */}
            {sessionId && messages.length ? (
                <div className="w-full">
                    <div className="flex items-center mb-4">
                        <button
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-xs text-slate-700 mr-2 cursor-pointer"
                            onClick={() => onSelectSession?.(null)}
                        >
                            ← Back to sessions
                        </button>
                        <h2 className="text-lg font-semibold mb-2">Session Messages</h2>
                    </div>
                    <ul className="space-y-2">
                        {messages.map((msg) => (
                            <li
                                key={msg.id}
                                className="border rounded p-2 flex flex-col gap-1 bg-slate-50"
                            >
                                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default SessionMemoryItemList;
