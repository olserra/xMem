'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Avatar from '@/app/Avatar';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { useSearch } from '@/app/docs/SearchContext';

function useSafeSearch() {
    try {
        return useSearch();
    } catch {
        return null;
    }
}

const Header: React.FC = () => {
    const { data: session } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const isDocs = pathname.startsWith('/docs');
    const searchCtx = useSafeSearch();

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

    const handleClick = () => {
        router.push('/');
    };

    return (
        <header className="w-full h-16 bg-slate-900 text-white flex items-center justify-between px-6 shadow-md">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleClick}>
                <Brain size={28} className="text-teal-400" />
                <span className="font-bold text-xl">xmem</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <Link
                        href="/docs"
                        className="text-slate-200 hover:text-teal-400 transition-colors font-medium cursor-pointer"
                    >
                        Documentation
                    </Link>
                    {isDocs && searchCtx && (
                        <SearchBar value={searchCtx.search} onChange={searchCtx.setSearch} />
                    )}
                </div>
                {/* Placeholder for user/account actions */}
                {user ? (
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
                ) : null}
            </div>
        </header>
    );
};

export default Header; 