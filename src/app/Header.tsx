'use client';
//create here the header for the landing page only, not for the dashboard

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Avatar from './Avatar';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../components/ui/Logo';
import Image from 'next/image';
import { Check, Menu, X } from 'lucide-react';
import { useTagContext } from '../components/tags/TagContext';

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
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const user = session?.user;
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isLanding = pathname === '/';
    // Organization/project dropdown state
    const [orgs, setOrgs] = useState<Organization[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
    const orgDropdownRef = useRef<HTMLDivElement>(null);
    const [orgsError, setOrgsError] = useState<string | null>(null);
    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [orgsLoading, setOrgsLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { clearTags } = useTagContext();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Set initial value on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Only fetch orgs/projects if user is authenticated and not on landing
    useEffect(() => {
        if (!user || isLanding) return;
        setOrgsLoading(true);
        setProjectsLoading(true);
        setOrgsError(null);
        setProjectsError(null);
        fetch('/api/organizations')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setOrgs(data);
                    setCurrentOrg(data[0] || null);
                } else {
                    setOrgs([]);
                    setCurrentOrg(null);
                    setOrgsError(data.error || 'Failed to load organizations');
                }
            })
            .catch(() => setOrgsError('Failed to load organizations'))
            .finally(() => setOrgsLoading(false));
        fetch('/api/projects')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setProjects(data);
                    setCurrentProject(data[0] || null);
                } else {
                    setProjects([]);
                    setCurrentProject(null);
                    setProjectsError(data.error || 'Failed to load projects');
                }
            })
            .catch(() => setProjectsError('Failed to load projects'))
            .finally(() => setProjectsLoading(false));
    }, [user, isLanding]);

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

    const headerClass = `w-full h-16 fixed top-0 left-0 z-30 transition-colors duration-300 ${scrolled ? 'bg-slate-100/50 text-slate-900 shadow-lg backdrop-blur-md' : 'bg-slate-900 text-white shadow-md'} flex items-center justify-between px-8`;

    // Always include Documentation in navLinks; Dashboard only if user is present
    const navLinks = [
        ...(user ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
        { href: '/docs', label: 'Documentation' },
    ];

    return (
        <header className={headerClass}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
                <Logo size={28} />
            </div>
            {/* Desktop nav */}
            <nav className="hidden md:flex flex-1 items-center gap-6 justify-end">
                {navLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`font-medium px-3 py-2 transition-colors flex flex-col items-center justify-center ${pathname.startsWith(link.href) ? 'text-white' : 'hover:text-teal-400 text-slate-200 rounded'}`}
                    >
                        <span>{link.label}</span>
                        {pathname.startsWith(link.href) && (
                            <span className="border-b-2 border-teal-500 w-3/4 mt-1.5 inline-block mx-auto"></span>
                        )}
                    </Link>
                ))}
            </nav>
            {/* Burger menu button (mobile only) */}
            <button className="md:hidden p-2 rounded focus:outline-none text-white" onClick={() => setMobileNavOpen(v => !v)} aria-label="Open menu">
                {mobileNavOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            {/* Desktop user/org/project controls */}
            <div className="hidden md:flex items-center gap-6">
                {!isLanding && user && (
                    <div className="relative flex-shrink-0" ref={orgDropdownRef}>
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
                                {orgsLoading && <div className="px-3 py-2 text-xs text-slate-400">Loading...</div>}
                                {orgsError && <div className="px-3 py-2 text-xs text-red-500">{orgsError}</div>}
                                {orgs.length === 0 && !orgsLoading && !orgsError && (
                                    <div className="px-3 py-2 text-xs text-slate-400">No organizations found</div>
                                )}
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
                                {projectsLoading && <div className="px-3 py-2 text-xs text-slate-400">Loading...</div>}
                                {projectsError && <div className="px-3 py-2 text-xs text-red-500">{projectsError}</div>}
                                {projects.length === 0 && !projectsLoading && !projectsError && (
                                    <div className="px-3 py-2 text-xs text-slate-400">No projects found</div>
                                )}
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
                {!loading && user && (
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
                                        clearTags();
                                        window.location.href = '/';
                                    }}
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {!loading && !user && (isLanding || pathname.startsWith('/docs')) && (
                    <>
                        <button
                            className="ml-4 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors cursor-pointer"
                            onClick={() => router.push('/api/auth/signin')}
                        >
                            Get started
                        </button>
                        <a
                            href="https://www.producthunt.com/posts/xmem?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-xmem"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-4"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <Image
                                src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=652438&theme=light&t=1747929728997"
                                alt="xmem - Streamline Knowledge Sharing Across Teams | Product Hunt"
                                width={150}
                                height={32}
                                style={{ width: 150, height: 32 }}
                                priority
                            />
                        </a>
                    </>
                )}
            </div>
            {/* Mobile nav drawer */}
            {mobileNavOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 flex md:hidden">
                    <div className="w-64 bg-slate-900 h-full shadow-lg flex flex-col p-6 gap-6 relative">
                        <button className="absolute top-4 right-4 p-2 text-white" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                            <X size={28} />
                        </button>
                        <div className="flex items-center gap-2 mb-6">
                            <Logo size={28} />
                        </div>
                        {/* Only show nav links if NOT on landing */}
                        {!isLanding && (
                            <nav className="flex flex-col gap-3">
                                {navLinks.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`font-medium px-3 py-2 transition-colors flex flex-col items-center justify-center ${pathname.startsWith(link.href) ? 'text-white' : 'hover:bg-teal-400/20 text-slate-200 rounded'}`}
                                        onClick={() => setMobileNavOpen(false)}
                                    >
                                        <span>{link.label}</span>
                                        {pathname.startsWith(link.href) && (
                                            <span className="border-b-2 border-teal-400 w-3/4 mt-1.5 inline-block mx-auto"></span>
                                        )}
                                    </Link>
                                ))}
                            </nav>
                        )}
                        <div className="mt-8 flex flex-col gap-4">
                            {/* User/org/project controls (mobile) */}
                            {!isLanding && user && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-slate-200 font-medium">{user.name || user.email || 'User'}</span>
                                    {currentOrg && <span className="text-xs text-slate-300">{currentOrg.name}</span>}
                                    {currentProject && <span className="text-xs text-slate-400">/ {currentProject.name}</span>}
                                </div>
                            )}
                            {!loading && user && (
                                <button className="flex items-center gap-2 text-slate-200 hover:text-teal-400" onClick={async () => { await signOut({ callbackUrl: '/', redirect: false }); clearTags(); window.location.href = '/'; }}>
                                    <Avatar imageUrl={user.image ?? undefined} name={user.name || user.email || 'User'} size={32} />
                                    <span>Sign out</span>
                                </button>
                            )}
                            {/* On landing, no session: show Get started link above Product Hunt badge */}
                            {((isLanding || pathname.startsWith('/docs')) && !loading && !user) && (
                                <>
                                    <button
                                        className="w-full px-4 py-2 mb-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors cursor-pointer"
                                        onClick={() => { setMobileNavOpen(false); router.push('/api/auth/signin'); }}
                                    >
                                        Get started
                                    </button>
                                    <a
                                        href="https://www.producthunt.com/posts/xmem?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-xmem"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                    >
                                        <Image
                                            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=652438&theme=light&t=1747929728997"
                                            alt="xmem - Streamline Knowledge Sharing Across Teams | Product Hunt"
                                            width={150}
                                            height={32}
                                            style={{ width: 150, height: 32 }}
                                            priority
                                        />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
                </div>
            )}
        </header>
    );
};

export default Header;
