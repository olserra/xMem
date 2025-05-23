'use client';
import React, { useEffect, useState } from 'react';
import ContextManager from '../../ContextManager';
import { PlusCircle, Edit, Trash2, Check, X } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { Project } from './types';

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

    useEffect(() => {
        fetchProjects();
        // eslint-disable-next-line
    }, []);

    if (status === 'unauthenticated') {
        return (
            <div className="p-8 text-center text-slate-500">
                Please <button className="text-indigo-600 underline" onClick={() => signIn()}>log in</button> to manage your projects.
            </div>
        );
    }

    const fetchProjects = () => {
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
    };

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
    const handleDelete = async (id: string) => {
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
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading projects...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!projects.length) return (
        <div className="p-8 text-center text-slate-500">
            No projects found.<br />
            <button onClick={openCreateModal} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center gap-2 cursor-pointer">
                <PlusCircle size={16} /> Create Project
            </button>
            {showModal && (
                <ProjectModal
                    mode={modalMode}
                    name={modalName}
                    desc={modalDesc}
                    setName={setModalName}
                    setDesc={setModalDesc}
                    onClose={() => setShowModal(false)}
                    onSave={handleModalSave}
                    error={error}
                />
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 p-4">
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
                <button onClick={openCreateModal} className="ml-2 px-2 py-1 bg-indigo-600 text-white rounded flex items-center gap-1 cursor-pointer text-sm h-9 min-w-[80px] flex-shrink-0"><PlusCircle size={16} /> New</button>
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
            {showModal && (
                <ProjectModal
                    mode={modalMode}
                    name={modalName}
                    desc={modalDesc}
                    setName={setModalName}
                    setDesc={setModalDesc}
                    onClose={() => setShowModal(false)}
                    onSave={handleModalSave}
                    error={error}
                />
            )}
            {selectedProject && <ContextManager projectId={selectedProject} />}
        </div>
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