'use client';
//create here the header for the landing page only, not for the dashboard

import React, { useEffect, useState, useRef } from 'react';
import { Brain } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Avatar from './Avatar';
import navLinks from '../components/layout/navLinks';
import SearchBar from '../components/layout/SearchBar';
import { usePathname } from 'next/navigation';
import { useSearch } from '../app/docs/SearchContext';

interface NavLink {
    href: string;
    label: string;
}

const Header: React.FC = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const user = session?.user;
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isDocs = pathname.startsWith('/docs');
    const searchCtx = isDocs ? useSearch() : null;

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const headerClass = `w-full h-16 fixed top-0 left-0 z-30 transition-colors duration-300 ${mounted && scrolled ? 'bg-slate-100/50 text-slate-900 shadow-lg backdrop-blur-md' : 'bg-slate-900 text-white shadow-md'} flex items-center justify-between px-8`;

    return (
        <header className={headerClass}>
            <div className="flex items-center gap-3">
                <Brain size={28} className="text-teal-400" />
                <span className="font-bold text-xl">xmem</span>
            </div>
            {isDocs ? (
                <div className="flex-1 flex justify-center">
                    <div className="w-full max-w-lg">
                        <SearchBar value={searchCtx?.search ?? ''} onChange={searchCtx?.setSearch ?? (() => { })} />
                    </div>
                </div>
            ) : (
                <div className="flex-1" />
            )}
            <div className="flex items-center gap-6">
                {(navLinks as NavLink[]).map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="hover:text-teal-400 transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
                {!loading && user ? (
                    <div className="relative ml-4" ref={dropdownRef}>
                        <button className="focus:outline-none cursor-pointer" onClick={() => setDropdownOpen((v) => !v)}>
                            <Avatar imageUrl={user.image ?? undefined} name={user.name || ''} size={40} />
                        </button>
                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-md shadow-lg z-20">
                                <div className="px-4 py-2 border-b border-slate-200 font-semibold">{user.name}</div>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                >
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors font-medium ml-4"
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    >
                        Get Started
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
