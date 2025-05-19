'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            // Set a fake auth_token cookie (expires in 1 day)
            document.cookie = `auth_token=demo-token; path=/; max-age=86400`;
            router.push('/dashboard');
        } else {
            setError('Please enter username and password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-6">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <div>
                    <label className="block text-slate-700 mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-slate-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-2 border border-slate-300 rounded"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors font-medium"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
} 