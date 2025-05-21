import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import SessionProviderWrapper from '../../components/SessionProviderWrapper';
import Footer from '../../components/layout/Footer';
import DocsSidebar from './DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProviderWrapper>
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
                <Header />
                <div className="flex flex-1 pt-16">
                    <DocsSidebar />
                    <main className="flex-1 p-8 md:p-12">
                        <div className="max-w-3xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </SessionProviderWrapper>
    );
} 