// app/api/knowledge-base/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Validate userId
    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required.' },
            { status: 400 }
        );
    }

    try {
        // Fetch the knowledge base for the specified user
        const knowledge = await prisma.userKnowledge.findUnique({
            where: { userId },
        });

        if (!knowledge) {
            return NextResponse.json(
                { error: 'No knowledge base found for this user.' },
                { status: 404 }
            );
        }

        return NextResponse.json(knowledge, { status: 200 });
    } catch (error) {
        console.error('Error fetching user knowledge:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user knowledge.' },
            { status: 500 }
        );
    }
};


// Handle POST requests
export const POST = async (req: Request) => {
    const { userId, preferences } = await req.json();

    // Validate userId
    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required.' },
            { status: 400 }
        );
    }

    // Validate preferences
    if (!preferences || typeof preferences !== 'object') {
        return NextResponse.json(
            { error: 'Valid preferences data is required.' },
            { status: 400 }
        );
    }

    try {
        // Upsert the user's knowledge (create or update)
        const knowledge = await prisma.userKnowledge.upsert({
            where: { userId },
            update: { preferences },
            create: {
                userId,
                preferences,
            },
        });

        return NextResponse.json(knowledge, { status: 200 });
    } catch (error) {
        console.error('Error updating user knowledge:', error);
        return NextResponse.json(
            { error: 'Failed to update user knowledge.' },
            { status: 500 }
        );
    }
};