'use client';
//create here the header for the landing page only, not for the dashboard

import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Avatar from './Avatar';
import navLinks from '../components/layout/navLinks';

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

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerClass = `w-full h-16 fixed top-0 left-0 z-30 transition-colors duration-300 ${mounted && scrolled ? 'bg-slate-100/50 text-slate-900 shadow-lg backdrop-blur-md' : 'bg-slate-900 text-white shadow-md'} flex items-center justify-between px-8`;

    return (
        <header className={headerClass}>
            <div className="flex items-center gap-3">
                <Brain size={28} className="text-teal-400" />
                <span className="font-bold text-xl">xmem</span>
            </div>
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
                    <div className="relative group ml-4">
                        <button className="focus:outline-none">
                            <Avatar imageUrl={user.image ?? undefined} name={user.name || ''} size={40} />
                        </button>
                        {/* Dropdown menu */}
                        <div className="absolute right-0 mt-2 w-40 bg-white text-slate-800 rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                            <div className="px-4 py-2 border-b border-slate-200 font-semibold">{user.name}</div>
                            <button
                                className="w-full text-left px-4 py-2 hover:bg-slate-100"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                Sign out
                            </button>
                        </div>
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
