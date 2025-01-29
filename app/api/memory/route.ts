import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Function to validate the API key and extract the userId
const getUserIdFromToken = async (token: string) => {
    const apiKey = await prisma.apiKey.findUnique({
        where: { key: token },
        include: { user: true },
    });
    return apiKey ? apiKey.userId : null;
};

export async function GET(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    try {
        const memories = await prisma.memory.findMany({
            where: {
                userId,
                ...(projectId && { projectId }),
            },
            include: {
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(memories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { memories, content, type = 'note', metadata = {}, projectId } = await req.json();

    try {
        if (memories && Array.isArray(memories)) {
            // Handle bulk import of memories
            await prisma.memory.createMany({
                data: memories.map((memory) => ({
                    ...memory,
                    userId,
                    projectId: memory.projectId || projectId,
                    type: memory.type || 'note',
                    isArchived: false,
                    version: 1,
                })),
            });

            // Fetch the newly created memories
            const createdMemories = await prisma.memory.findMany({
                where: {
                    userId,
                    content: { in: memories.map((memory) => memory.content) },
                },
            });

            return NextResponse.json(createdMemories, { status: 201 });
        } else if (content) {
            // Handle single memory creation
            const newMemory = await prisma.memory.create({
                data: {
                    content,
                    type,
                    metadata,
                    userId,
                    ...(projectId && { projectId }),
                    isArchived: false,
                    version: 1,
                },
            });

            return NextResponse.json(newMemory, { status: 201 });
        } else {
            return NextResponse.json({ error: 'Content is required for single memory creation' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error creating memory:', error);
        return NextResponse.json({
            error: 'Failed to create memory. Please ensure all required fields are provided.',
        }, { status: 500 });
    }
}
