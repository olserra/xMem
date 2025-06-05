'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '../components/ui/Logo';
import Avatar from './Avatar';

const githubLink = 'https://github.com/olserra/xmem';

const DocumentationHeader: React.FC = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        ...(user ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    ];

    const headerClass = `w-full h-16 fixed top-0 left-0 z-30 transition-colors duration-300 bg-slate-900 text-white shadow-md flex items-center justify-between px-8`;

    useEffect(() => {
        if (!dropdownOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownOpen]);

    return (
        <header className={headerClass}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}> <Logo size={28} /> </div>
            <nav className="hidden md:flex flex-1 items-center gap-6 justify-end">
                {navLinks.map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`font-medium px-3 py-2 transition-colors flex flex-col items-center justify-center hover:text-teal-400 text-slate-200 rounded`}
                    >
                        <span>{link.label}</span>
                    </Link>
                ))}
                {user && (
                    <div className="relative ml-4" ref={dropdownRef}>
                        <button className="focus:outline-none cursor-pointer" onClick={() => setDropdownOpen((v) => !v)}>
                            <Avatar imageUrl={user.image ?? undefined} name={user.name || user.email || 'User'} size={40} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-md shadow-lg z-20">
                                <div className="px-4 py-2 border-b border-slate-200 font-semibold">
                                    {user.name || user.email}
                                    {user.email && user.name && (
                                        <div className="text-xs text-slate-500 mt-1">{user.email}</div>
                                    )}
                                </div>
                                <button
                                    className="w-full text-left px-4 py-2 text-xs font-bold text-rose-700 hover:bg-slate-100 cursor-pointer"
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
                )}
            </nav>
        </header>
    );
};

export default DocumentationHeader; 