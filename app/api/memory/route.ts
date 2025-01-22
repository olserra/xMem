import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const projectId = searchParams.get("projectId");

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(memories);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { content, type = "note", tags = [], metadata = {}, projectId, userId } = await req.json();

    if (!content || !userId) {
        return NextResponse.json({
            error: 'Content and userId are required'
        }, { status: 400 });
    }

    try {
        const newMemory = await prisma.memory.create({
            data: {
                content,
                type,
                tags, // This will default to an empty array if not provided
                metadata,
                userId: userId,
                ...(projectId && { projectId }),
                isArchived: false,
                version: 1
            },
        });
        return NextResponse.json(newMemory, { status: 201 });
    } catch (error) {
        console.error('Error creating memory:', error);
        return NextResponse.json({
            error: 'Failed to create memory. Please ensure all required fields are provided.'
        }, { status: 500 });
    }
}
