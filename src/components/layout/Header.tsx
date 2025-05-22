'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/app/Avatar';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Logo from '../ui/Logo';
import { LuMenu } from 'react-icons/lu';


const Header: React.FC = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [scrolled, setScrolled] = useState(false);

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
            <div className="hidden md:flex items-center gap-4">
                <div className="flex gap-2">
                    <Link
                        href="/docs"
                        className="text-slate-200 hover:text-teal-400 transition-colors font-medium cursor-pointer"
                    >
                        Documentation
                    </Link>
                </div>
                {user ? (
                    <div className="relative ml-4" ref={dropdownRef}>
                        <button className="focus:outline-none cursor-pointer" onClick={() => setDropdownOpen((v) => !v)}>
                            <Avatar imageUrl={user.image ?? undefined} name={user.name || ''} size={40} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-md shadow-lg z-20">
                                <div className="px-4 py-2 border-b border-slate-200 font-semibold">{user.name}</div>
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