'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/app/Avatar';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Logo from '../ui/Logo';
import { LuMenu } from 'react-icons/lu';
import { Check } from 'lucide-react';

// Define types for organization and project
interface Organization {
    id: string;
    name: string;
    description: string | null;
}
interface Project {
    id: string;
    name: string;
    organizationId?: string;
}

const Header: React.FC = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);
    // Organization/project dropdown state
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const orgDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch orgs and projects for dropdown
    useEffect(() => {
        if (!user) return;
        fetch('/api/organizations').then(res => res.json()).then(data => {
            setOrgs(data);
            setCurrentOrg(data[0] || null);
        });
        fetch('/api/projects').then(res => res.json()).then(data => {
            setProjects(data);
            setCurrentProject(data[0] || null);
        });
    }, [user]);

    // Close org dropdown on outside click
    useEffect(() => {
        if (!orgDropdownOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
                setOrgDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [orgDropdownOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = () => {
        router.push('/');
    };

    const headerClass = `w-full h-16 fixed top-0 left-0 z-30 transition-colors duration-300 flex items-center justify-between px-4 md:px-6 shadow-md ${scrolled ? 'bg-slate-800/80 text-white backdrop-blur-md' : 'bg-transparent text-slate-900 md:bg-slate-900 md:text-white md:backdrop-blur-none'}`;

    return (
        <header className={headerClass}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleClick}>
                <Logo size={28} />
            </div>
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center w-full">
                {/* Left: org/project dropdown as a link */}
                {user && (
                    <div className="relative flex-shrink-0 ml-0 md:ml-[256px]" ref={orgDropdownRef}>
                        <span
                            className="flex items-center gap-2 text-slate-200 hover:text-teal-400 font-medium cursor-pointer select-none"
                            onClick={() => setOrgDropdownOpen(v => !v)}
                            tabIndex={0}
                            role="button"
                            style={{ outline: 'none' }}
                        >
                            <span>{user.name || user.email || 'User'}</span>
                            {currentOrg && (
                                <span className="text-xs text-slate-300">{currentOrg.name}</span>
                            )}
                            {currentProject && (
                                <span className="text-xs text-slate-400">/ {currentProject.name}</span>
                            )}
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        {orgDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-md shadow-lg z-30 p-2">
                                <div className="mb-2 text-xs text-slate-500 px-2 select-none">Organizations</div>
                                {orgs.map((org) => (
                                    <div
                                        key={org.id}
                                        className={`px-3 py-2 rounded flex items-center gap-2 hover:bg-teal-50 transition-colors ${currentOrg?.id === org.id ? 'bg-teal-100 font-semibold' : ''} cursor-pointer`}
                                        onClick={() => { setCurrentOrg(org); setOrgDropdownOpen(false); }}
                                    >
                                        {org.name}
                                        {currentOrg?.id === org.id && <Check size={16} className="text-teal-500 ml-auto" />}
                                    </div>
                                ))}
                                <div className="mt-3 mb-2 text-xs text-slate-500 px-2 select-none">Projects</div>
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className={`px-3 py-2 rounded flex items-center gap-2 hover:bg-teal-50 transition-colors ${currentProject?.id === project.id ? 'bg-teal-100 font-semibold' : ''} cursor-pointer`}
                                        onClick={() => { setCurrentProject(project); setOrgDropdownOpen(false); router.push('/dashboard/context'); }}
                                    >
                                        {project.name}
                                        {currentProject?.id === project.id && <Check size={16} className="text-teal-500 ml-auto" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* Spacer to push nav and avatar to the right */}
                <div className="flex-grow" />
                {/* Right: nav and avatar */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/docs"
                        className="text-slate-200 hover:text-teal-400 transition-colors font-medium cursor-pointer"
                    >
                        Documentation
                    </Link>
                    {user ? (
                        <div className="relative ml-4" ref={dropdownRef}>
                            <button className="focus:outline-none cursor-pointer" onClick={() => setDropdownOpen((v) => !v)}>
                                <Avatar imageUrl={user.image ?? undefined} name={user.name || user.email || 'User'} size={40} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-md shadow-lg z-20">
                                    <div className="px-4 py-2 border-b border-slate-200 font-semibold">{user.name || user.email}</div>
                                    <button
                                        className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                        onClick={async () => {
                                            await signOut({ callbackUrl: '/', redirect: false });
                                            window.location.href = '/';
                                        }}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
            {/* Mobile hamburger menu */}
            <div className="md:hidden flex items-center relative">
                <button
                    className="focus:outline-none"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-label="Open menu"
                >
                    <LuMenu size={32} />
                </button>
                {/* Mobile dropdown menu */}
                {dropdownOpen && (
                    <div className="absolute top-16 right-0 w-48 bg-slate-900 text-white rounded-md shadow-lg z-30 animate-fade-in md:hidden">
                        <Link
                            href="/docs"
                            className="block px-4 py-3 hover:bg-slate-800 border-b border-slate-800 font-medium"
                            onClick={() => setDropdownOpen(false)}
                        >
                            Documentation
                        </Link>
                        {user && (
                            <>
                                <div className="px-4 py-2 border-b border-slate-800 font-semibold">{user.name}</div>
                                <button
                                    className="w-full text-left px-4 py-3 hover:bg-slate-800"
                                    onClick={async () => {
                                        setDropdownOpen(false);
                                        await signOut({ callbackUrl: '/', redirect: false });
                                        window.location.href = '/';
                                    }}
                                >
                                    Sign out
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header; 