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
    const { memories, content, type = "note", metadata = {}, projectId, userId } = await req.json();

    if (!userId) {
        return NextResponse.json({
            error: 'User ID is required'
        }, { status: 400 });
    }

    try {
        if (memories && Array.isArray(memories)) {
            // Handle bulk import of memories
            const newMemories = await prisma.memory.createMany({
                data: memories.map(memory => ({
                    ...memory,
                    userId,
                    projectId: memory.projectId || projectId,
                    type: memory.type || "note", // Ensure type is provided
                    isArchived: false,
                    version: 1,
                })),
            });
            return NextResponse.json(newMemories, { status: 201 });
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
                    version: 1
                },
            });
            return NextResponse.json(newMemory, { status: 201 });
        } else {
            return NextResponse.json({
                error: 'Content is required for single memory creation'
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error creating memory:', error);
        return NextResponse.json({
            error: 'Failed to create memory. Please ensure all required fields are provided.'
        }, { status: 500 });
    }
}