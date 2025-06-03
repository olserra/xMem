'use client';
import React from 'react';
import DocumentationHeader from '../DocumentationHeader';
import SessionProviderWrapper from '../../components/SessionProviderWrapper';
import Footer from '../../components/layout/Footer';
import DocsSidebar from './DocsSidebar';
import { SearchProvider } from './SearchContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const { status } = useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        }
    }, [status, router]);

    if (status === 'loading') return null;

    return (
        <SessionProviderWrapper>
            <SearchProvider>
                <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
                    <DocumentationHeader />
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
            </SearchProvider>
        </SessionProviderWrapper>
    );
} 