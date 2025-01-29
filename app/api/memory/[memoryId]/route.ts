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

export async function GET(req: Request, { params }: { params: { memoryId: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    try {
        const memory = await prisma.memory.findUnique({
            where: { id: params.memoryId },
        });
        if (!memory) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }
        if (memory.userId !== userId) {
            return NextResponse.json({ error: 'Not authorized to access this memory' }, { status: 403 });
        }

        return NextResponse.json(memory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { memoryId: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { content, projectId } = await req.json();

    try {
        const memory = await prisma.memory.findUnique({
            where: { id: params.memoryId },
        });

        if (!memory) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }

        if (memory.userId !== userId) {
            return NextResponse.json({ error: 'Not authorized to update this memory' }, { status: 403 });
        }

        const updatedMemory = await prisma.memory.update({
            where: { id: params.memoryId },
            data: {
                content,
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
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { memoryId } = params; // Extract memoryId from the route

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
