import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function GET(req: Request, { params }: { params: { memoryId: string } }) {
    try {
        const memory = await prisma.memory.findUnique({
            where: { id: params.memoryId },
        });
        if (!memory) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }
        return NextResponse.json(memory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { memoryId: string } }) {
    const { content, tags, projectId } = await req.json();

    if (!content || !tags || tags.length < 3) {
        return NextResponse.json({ error: 'Memory content and at least 3 tags are required' }, { status: 400 });
    }

    try {
        const updatedMemory = await prisma.memory.update({
            where: { id: params.memoryId },
            data: {
                content,
                tags,
                projectId: projectId || null,
                updatedAt: new Date(),
            },
        });
        return NextResponse.json(updatedMemory, { status: 200 });
    } catch (error) {
        console.error('Error updating memory:', error);
        return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { memoryId: string } }) {
    const { memoryId } = params;  // Extract memoryId from the route
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');  // Extract userId from query parameters

    if (!memoryId || !userId) {
        return NextResponse.json({ error: 'Missing memoryId or userId' }, { status: 400 });
    }

    try {
        const memory = await prisma.memory.findUnique({
            where: { id: memoryId },
        });

        if (!memory || memory.userId !== userId) {
            return NextResponse.json({ error: 'Memory not found or user is not authorized' }, { status: 404 });
        }

        const deletedMemory = await prisma.memory.delete({
            where: { id: memoryId },
        });

        return NextResponse.json(deletedMemory, { status: 200 });
    } catch (error) {
        console.error('Error deleting memory:', error);
        return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
    }
}