import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';
import crypto from 'crypto';

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
            ...(projectId && {
                MemoryProject: {
                    some: {
                        projectId: projectId
                    }
                }
            }),
            ...(subject && {
                subjects: {
                    some: {
                        id: subject,
                    },
                },
            }),
        };

        const [data, total] = await Promise.all([
            prisma._data.findMany({
                where,
                include: {
                    subjects: true,
                    MemoryProject: {
                        include: {
                            Project: true
                        }
                    },
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
            prisma._data.count({ where }),
        ]);

        return NextResponse.json({
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
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

        const _data = await prisma._data.create({
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
                MemoryProject: projectId ? {
                    create: {
                        id: `${crypto.randomUUID()}`,
                        projectId: projectId,
                        updatedAt: new Date()
                    }
                } : undefined,
                subjects: subjects && subjects.length > 0 ? {
                    connect: subjects.filter(id => id).map(id => ({ id }))
                } : undefined,
                Memory_B: relatedMemoryIds && relatedMemoryIds.length > 0 ? {
                    connect: relatedMemoryIds.filter(id => id).map(id => ({ id }))
                } : undefined,
            },
            include: {
                subjects: true,
                MemoryProject: {
                    include: {
                        Project: true
                    }
                },
                Memory_B: {
                    select: {
                        id: true,
                        content: true,
                        source: true,
                    },
                },
            },
        });

        return NextResponse.json(_data);
    } catch (error) {
        console.error('Error creating _data:', error);
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

        // Verify the _data belongs to the user
        const existingMemory = await prisma._data.findUnique({
            where: { id },
        });

        if (!existingMemory || existingMemory.userId !== userId) {
            return NextResponse.json({ error: 'Memory not found or unauthorized' }, { status: 404 });
        }

        const _data = await prisma._data.update({
            where: { id },
            data: {
                content,
                type,
                confidence,
                sentiment,
                language,
                tags,
                metadata,
                MemoryProject: projectId ? {
                    upsert: {
                        create: {
                            id: `${crypto.randomUUID()}`,
                            projectId: projectId,
                            updatedAt: new Date()
                        },
                        update: {
                            updatedAt: new Date()
                        },
                        where: { _dataId_projectId: { _dataId: id, projectId: projectId } }
                    }
                } : undefined,
                subjects: subjects && subjects.length > 0 ? {
                    set: subjects.filter(id => id).map(id => ({ id }))
                } : undefined,
                Memory_B: relatedMemoryIds && relatedMemoryIds.length > 0 ? {
                    set: relatedMemoryIds.filter(id => id).map(id => ({ id }))
                } : undefined,
            },
            include: {
                subjects: true,
                MemoryProject: {
                    include: {
                        Project: true
                    }
                },
                Memory_B: {
                    select: {
                        id: true,
                        content: true,
                        source: true,
                    },
                },
            },
        });

        return NextResponse.json(_data);
    } catch (error) {
        console.error('Error updating _data:', error);
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

        // Verify the _data belongs to the user
        const _data = await prisma._data.findUnique({
            where: { id },
        });

        if (!_data || _data.userId !== userId) {
            return NextResponse.json({ error: 'Memory not found or unauthorized' }, { status: 404 });
        }

        await prisma._data.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting _data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

