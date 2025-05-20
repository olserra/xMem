import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import SessionProviderWrapper from './SessionProviderWrapper';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProviderWrapper>
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
                <Header />
                <div className="flex flex-1 pt-16">
                    {/* Sidebar */}
                    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:block">
                        <nav className="space-y-4">
                            <h2 className="text-slate-300 font-normal text-base mb-4">Documentation</h2>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/docs/get-started" className="ml-4 text-slate-300 hover:text-teal-400 font-normal text-sm">Get Started</Link>
                                </li>
                                <li>
                                    <Link href="/docs/api" className="ml-4 text-slate-300 hover:text-teal-400 font-normal text-sm">API Reference</Link>
                                </li>
                                <li>
                                    <Link href="/docs/examples" className="ml-4 text-slate-300 hover:text-teal-400 font-normal text-sm">Examples</Link>
                                </li>
                                <li>
                                    <Link href="/docs/faq" className="ml-4 text-slate-300 hover:text-teal-400 font-normal text-sm">FAQ</Link>
                                </li>
                            </ul>
                        </nav>
                    </aside>
                    {/* Main Content */}
                    <main className="flex-1 p-8 md:p-12">
                        <div className="max-w-3xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </SessionProviderWrapper>
    );
} 