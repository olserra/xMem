'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import ContextManager from '../../ContextManager';
import { PlusCircle, Edit, Trash2, Check, X } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { Project } from '../../../types/context';
import { Database } from 'lucide-react';

export default function ContextPage() {
    const { status } = useSession();
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [modalName, setModalName] = useState('');
    const [modalDesc, setModalDesc] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [sources, setSources] = useState<any[]>([]);

    const fetchProjects = useCallback(() => {
        setLoading(true);
        fetch('/api/projects')
            .then(async res => {
                if (!res.ok) {
                    let errMsg = 'Failed to fetch projects';
                    try {
                        const err = await res.json();
                        if (res.status === 401) errMsg = 'Please log in to view your projects.';
                        else errMsg = err.error || errMsg;
                    } catch { }
                    throw new Error(errMsg);
                }
                return res.json();
            })
            .then(data => {
                setProjects(data);
                if (data.length > 0 && !selectedProject) setSelectedProject(data[0].id);
                if (data.length === 0) setSelectedProject(null);
            })
            .catch(e => {
                setError(e.message || 'Failed to fetch projects');
                setProjects([]);
                setSelectedProject(null);
            })
            .finally(() => setLoading(false));
    }, [selectedProject]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (!selectedProject) return setSources([]);
        fetch(`/api/vector-sources?projectId=${selectedProject}`)
            .then(res => res.json())
            .then(data => setSources(data || []))
            .catch(() => setSources([]));
    }, [selectedProject]);

    useEffect(() => { setIsClient(true); }, []);

    const handleDelete = useCallback(async (id: string) => {
        if (!window.confirm('Delete this project? This cannot be undone.')) return;
        setDeleting(id);
        try {
            await fetch('/api/projects', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            if (selectedProject === id) setSelectedProject(null);
            fetchProjects();
        } catch {
            setError('Failed to delete project');
        } finally {
            setDeleting(null);
        }
    }, [selectedProject, fetchProjects]);

    const openCreateModal = () => {
        setModalMode('create');
        setModalName('');
        setModalDesc('');
        setShowModal(true);
        setEditId(null);
        setError(null);
    };
    const openEditModal = (project: Project) => {
        setModalMode('edit');
        setModalName(project.name);
        setModalDesc(project.description || '');
        setEditId(project.id);
        setShowModal(true);
        setError(null);
    };

    // Memoize dashboard content to avoid re-renders from modal state
    const dashboardContent = useMemo(() => (
        <div className="space-y-6">
            <div className="flex items-center p-4 w-full">
                <div className="flex items-center gap-4 flex-shrink-0">
                    <label className="text-sm font-medium text-slate-700">Project:</label>
                    <select
                        value={selectedProject || ''}
                        onChange={e => setSelectedProject(e.target.value)}
                        className="px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-9"
                    >
                        {projects.map((p: Project) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                    {selectedProject && (
                        <>
                            <button onClick={() => {
                                const project = projects.find((p: Project) => p.id === selectedProject);
                                if (project) openEditModal(project);
                            }} className="ml-2 px-2 py-1 bg-slate-200 text-slate-700 rounded flex items-center gap-1 cursor-pointer text-sm h-9 min-w-[80px] flex-shrink-0"><Edit size={16} /> Rename</button>
                            <button onClick={() => handleDelete(selectedProject)} className="ml-2 px-2 py-1 bg-rose-100 text-rose-700 rounded flex items-center gap-1 cursor-pointer text-sm h-9 min-w-[80px] flex-shrink-0" disabled={deleting === selectedProject}><Trash2 size={16} /> {deleting === selectedProject ? 'Deleting...' : 'Delete'}</button>
                        </>
                    )}
                </div>
                <div className="flex-1 flex justify-end">
                    <button onClick={openCreateModal} className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2 cursor-pointer text-sm h-9 min-w-[120px]"><PlusCircle size={16} /> Create Project</button>
                </div>
            </div>
            {selectedProject && !showModal && (
                sources.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-full text-center text-slate-400">
                        No memory sources connected. Please{' '}
                        <a
                            href="/dashboard/memory"
                            className="text-indigo-600 underline hover:text-indigo-800 transition-colors"
                        >
                            add a source
                        </a>{' '}to view dashboard data.
                    </div>
                ) : (
                    <ContextManager projectId={selectedProject} />
                )
            )}
        </div>
    ), [projects, selectedProject, deleting, showModal, handleDelete, sources]);

    if (status === 'unauthenticated') {
        return (
            <div className="p-8 text-center text-slate-500">
                Please <button className="text-indigo-600 underline" onClick={() => signIn()}>log in</button> to manage your projects.
            </div>
        );
    }

    const handleModalSave = async () => {
        setError(null);
        if (!modalName.trim()) {
            setError('Project name is required');
            return;
        }
        try {
            if (modalMode === 'create') {
                await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: modalName, description: modalDesc }),
                });
            } else if (modalMode === 'edit' && editId) {
                await fetch('/api/projects', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editId, name: modalName, description: modalDesc }),
                });
            }
            setShowModal(false);
            fetchProjects();
        } catch {
            setError('Failed to save project');
        }
    };

    return (
        <>
            {loading && <div className="p-8 text-center text-slate-500">Loading projects...</div>}
            {error && <div className="p-8 text-center text-red-600">{error}</div>}
            {!loading && !error && !projects.length && (
                <div className="flex items-center justify-between p-8 w-full">
                    <div className="text-slate-500 text-lg">No projects found.</div>
                    <button onClick={openCreateModal} className="px-4 py-2 bg-indigo-600 text-white rounded flex items-center gap-2 cursor-pointer text-sm h-9 min-w-[120px]">
                        <PlusCircle size={16} /> Create Project
                    </button>
                </div>
            )}
            {!loading && !error && projects.length > 0 && dashboardContent}
            {showModal && typeof window !== 'undefined' && ReactDOM.createPortal(
                <ProjectModal
                    mode={modalMode}
                    name={modalName}
                    desc={modalDesc}
                    setName={setModalName}
                    setDesc={setModalDesc}
                    onClose={() => setShowModal(false)}
                    onSave={handleModalSave}
                    error={error}
                />,
                document.body
            )}
        </>
    );
}

interface ProjectModalProps {
    mode: 'create' | 'edit';
    name: string;
    desc: string;
    setName: (name: string) => void;
    setDesc: (desc: string) => void;
    onClose: () => void;
    onSave: () => void;
    error: string | null;
}

function ProjectModal({ mode, name, desc, setName, setDesc, onClose, onSave, error }: ProjectModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">{mode === 'create' ? 'Create Project' : 'Rename Project'}</h2>
                <input
                    type="text"
                    className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Project name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
                <textarea
                    className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Description (optional)"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-700 rounded cursor-pointer flex items-center gap-1"><X size={16} /> Cancel</button>
                    <button onClick={onSave} className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer flex items-center gap-1"><Check size={16} /> Save</button>
                </div>
            </div>
        </div>
    );
} 