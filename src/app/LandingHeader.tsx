'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Logo from '../components/ui/Logo';
import Avatar from './Avatar';
import { signOut } from 'next-auth/react';

const LandingHeader: React.FC = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const user = session?.user;
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const headerClass = `w-full h-16 fixed top-0 left-0 z-30 transition-colors duration-300 bg-slate-900 text-white shadow-md flex items-center justify-between px-8`;

    return (
        <header className={headerClass}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}> <Logo size={28} /> </div>
            <div className="hidden md:flex items-center gap-6">
                {!loading && !user && (
                    <button
                        className="ml-4 px-4 py-2 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors cursor-pointer"
                        onClick={() => router.push('/api/auth/signin')}
                    >
                        Get started
                    </button>
                )}
                {user && (
                    <div className="relative ml-4">
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
                )}
            </div>
        </header>
    );
};

export default LandingHeader; 