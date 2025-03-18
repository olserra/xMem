import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';

// Function to validate the API key and extract the userId
const getUserIdFromToken = async (token: string) => {
    const apiKey = await prisma.apiKey.findUnique({
        where: { key: token },
        include: { user: true },
    });
    return apiKey ? apiKey.userId : null;
};

// Function to get userId from either bearer token or session
const getUserId = async (request: Request) => {
    // Check if this is an API request with a bearer token
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (token) {
        const userId = await getUserIdFromToken(token);
        if (userId) return userId;
    }

    // For web requests, get the session
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        return user?.id || null;
    }

    return null;
};

export async function GET(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const source = searchParams.get('source');
        const subject = searchParams.get('subject');
        const projectId = searchParams.get('projectId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where = {
            userId,
            ...(source && { source }),
            ...(projectId && { projectId }),
            ...(subject && {
                subjects: {
                    some: {
                        id: subject,
                    },
                },
            }),
        };

        const [memories, total] = await Promise.all([
            prisma.memory.findMany({
                where,
                include: {
                    subjects: true,
                    project: true,
                    Memory_B: {
                        select: {
                            id: true,
                            content: true,
                            source: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.memory.count({ where }),
        ]);

        return NextResponse.json({
            memories,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching memories:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            content,
            type,
            projectId,
            source,
            sourceId,
            subjects,
            relatedMemoryIds,
            confidence,
            sentiment,
            language,
            tags,
            metadata,
        } = body;

        const memory = await prisma.memory.create({
            data: {
                content,
                type,
                userId,
                source,
                sourceId,
                confidence,
                sentiment,
                language,
                tags,
                metadata,
                project: projectId ? {
                    connect: { id: projectId }
                } : undefined,
                subjects: {
                    connect: subjects?.map((id: string) => ({ id })) || [],
                },
                Memory_B: {
                    connect: relatedMemoryIds?.map((id: string) => ({ id })) || [],
                },
            },
            include: {
                subjects: true,
                Memory_B: {
                    select: {
                        id: true,
                        content: true,
                        source: true,
                    },
                },
            },
        });

        return NextResponse.json(memory);
    } catch (error) {
        console.error('Error creating memory:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const {
            id,
            content,
            type,
            projectId,
            subjects,
            relatedMemoryIds,
            confidence,
            sentiment,
            language,
            tags,
            metadata,
        } = body;

        // Verify the memory belongs to the user
        const existingMemory = await prisma.memory.findUnique({
            where: { id },
        });

        if (!existingMemory || existingMemory.userId !== userId) {
            return NextResponse.json({ error: 'Memory not found or unauthorized' }, { status: 404 });
        }

        const memory = await prisma.memory.update({
            where: { id },
            data: {
                content,
                type,
                confidence,
                sentiment,
                language,
                tags,
                metadata,
                project: projectId ? {
                    connect: { id: projectId }
                } : {
                    disconnect: true
                },
                subjects: {
                    set: subjects?.map((id: string) => ({ id })) || [],
                },
                Memory_B: {
                    set: relatedMemoryIds?.map((id: string) => ({ id })) || [],
                },
            },
            include: {
                subjects: true,
                Memory_B: {
                    select: {
                        id: true,
                        content: true,
                        source: true,
                    },
                },
            },
        });

        return NextResponse.json(memory);
    } catch (error) {
        console.error('Error updating memory:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const userId = await getUserId(request);
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Memory ID is required' }, { status: 400 });
        }

        // Verify the memory belongs to the user
        const memory = await prisma.memory.findUnique({
            where: { id },
        });

        if (!memory || memory.userId !== userId) {
            return NextResponse.json({ error: 'Memory not found or unauthorized' }, { status: 404 });
        }

        await prisma.memory.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting memory:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

