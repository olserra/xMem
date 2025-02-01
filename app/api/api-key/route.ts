import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const apiKey = await prisma.apiKey.findUnique({
            where: { userId },
            select: { key: true },
        });

        if (apiKey) {
            return NextResponse.json({ apiKey: apiKey.key }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'No API key found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error fetching API key:', error);
        return NextResponse.json({ error: 'Error fetching API key' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const { userId, apiKey } = await request.json();

    if (!userId || !apiKey) {
        return NextResponse.json({ error: 'User ID and API Key are required' }, { status: 400 });
    }

    try {
        const existingKey = await prisma.apiKey.findUnique({
            where: { userId },
        });

        if (existingKey) {
            return NextResponse.json({ error: 'User already has an API key' }, { status: 400 });
        }

        const newApiKey = await prisma.apiKey.create({
            data: {
                id: apiKey,
                key: apiKey,
                userId,
            },
        });

        return NextResponse.json({ apiKey: newApiKey.key, message: 'API key created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error creating API key:', error);
        return NextResponse.json({ error: 'Error creating API key' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { userId } = await request.json();

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const existingKey = await prisma.apiKey.findUnique({
            where: { userId },
            select: { id: true },
        });

        if (!existingKey) {
            return NextResponse.json({ error: 'No API key found' }, { status: 404 });
        }

        await prisma.apiKey.delete({
            where: { id: existingKey.id },
        });

        return NextResponse.json({ message: 'API key deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting API key:', error);
        return NextResponse.json({ error: 'Error deleting API key' }, { status: 500 });
    }
}