import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const sourceConfigs = await prisma.sourceConfig.findMany({
            where: { userId: user.id },
        });

        return NextResponse.json(sourceConfigs);
    } catch (error) {
        console.error('Error fetching source configs:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { source, apiKey, apiSecret, webhookUrl, syncInterval } = body;

        const sourceConfig = await prisma.sourceConfig.upsert({
            where: {
                userId_source: {
                    userId: user.id,
                    source,
                },
            },
            update: {
                apiKey,
                apiSecret,
                webhookUrl,
                syncInterval,
                updatedAt: new Date(),
            },
            create: {
                userId: user.id,
                source,
                apiKey,
                apiSecret,
                webhookUrl,
                syncInterval,
                isEnabled: true,
            },
        });

        return NextResponse.json(sourceConfig);
    } catch (error) {
        console.error('Error creating/updating source config:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get('source');

        if (!source) {
            return NextResponse.json({ error: 'Source is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        await prisma.sourceConfig.delete({
            where: {
                userId_source: {
                    userId: user.id,
                    source,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting source config:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 