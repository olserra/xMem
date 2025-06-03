'use client';
import SessionProviderWrapper from '../../components/SessionProviderWrapper';
import DashboardShell from '../../components/layout/DashboardShell';
import { TagProvider } from '../../components/tags/TagContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
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
            <TagProvider>
                <DashboardShell>{children}</DashboardShell>
            </TagProvider>
        </SessionProviderWrapper>
    );
} 