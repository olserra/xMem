import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const apiKeys = await prisma.apiKey.findMany({
            where: { userId },
            select: {
                id: true,
                key: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ apiKeys }, { status: 200 });
    } catch (error) {
        console.error('Error fetching API keys:', error);
        return NextResponse.json({ error: 'Error fetching API keys' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const newApiKey = await prisma.apiKey.create({
            data: {
                key: generateUniqueKey(),
                userId,
            },
        });

        return NextResponse.json({
            apiKey: {
                id: newApiKey.id,
                key: newApiKey.key,
                createdAt: newApiKey.createdAt,
            },
            message: 'API key created successfully'
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating API key:', error);
        return NextResponse.json({ error: 'Error creating API key' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { keyId } = await request.json();

    if (!keyId) {
        return NextResponse.json({ error: 'API Key ID is required' }, { status: 400 });
    }

    try {
        await prisma.apiKey.delete({
            where: { id: keyId },
        });

        return NextResponse.json({ message: 'API key deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting API key:', error);
        return NextResponse.json({ error: 'Error deleting API key' }, { status: 500 });
    }
}

// Helper function to generate a unique API key
function generateUniqueKey(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}