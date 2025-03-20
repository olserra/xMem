import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { syncDataFromSource, syncAllEnabledSources } from '@/app/lib/sync/syncData';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get('source');

        if (source) {
            // Sync specific source
            const config = await prisma.sourceConfig.findFirst({
                where: {
                    source,
                    userId: session.user.id,
                },
            });

            if (!config) {
                return NextResponse.json(
                    { error: `No configuration found for source: ${source}` },
                    { status: 404 }
                );
            }

            const result = await syncDataFromSource(config);
            return NextResponse.json(result);
        } else {
            // Sync all enabled sources
            const results = await syncAllEnabledSources();
            return NextResponse.json(results);
        }
    } catch (error) {
        console.error('Error syncing data:', error);
        return NextResponse.json(
            { error: 'Failed to sync data' },
            { status: 500 }
        );
    }
} 