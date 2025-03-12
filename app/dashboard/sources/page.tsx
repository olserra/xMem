'use client';

import { SourceConfig } from '@/app/components/sources/SourceConfig';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';

export default function SourcesPage() {
    return (
        <MaxWidthWrapper>
            <div className="p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Source Management</h1>
                    <p className="text-gray-600 mt-2">
                        Configure and manage your AI source integrations. Enable or disable sources, set up API keys, and configure sync intervals.
                    </p>
                </div>
                <SourceConfig />
            </div>
        </MaxWidthWrapper>
    );
} 