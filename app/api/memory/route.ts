import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Fetch and store user memory (GET and POST requests)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const memory = await prisma.memory.findMany({
            where: { userId },
        });
        return NextResponse.json(memory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const { text, tags } = await req.json();  // Receive text and tags

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!text || !tags || tags.length < 3) {
        return NextResponse.json({ error: 'Memory text and at least 3 tags are required' }, { status: 400 });
    }

    try {
        const newMemory = await prisma.memory.create({
            data: {
                userId,
                data: { text, tags },   // Store the text and tags in a JSON field
            },
        });
        return NextResponse.json(newMemory, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const memoryId = searchParams.get("memoryId");

    if (!userId || !memoryId) {
        return NextResponse.json({ error: 'User ID and Memory ID are required' }, { status: 400 });
    }

    try {
        // Delete the memory by userId and memoryId
        const deletedMemory = await prisma.memory.delete({
            where: {
                id: memoryId,
                userId: userId,
            },
        });
        return NextResponse.json(deletedMemory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const memoryId = searchParams.get("memoryId");
    const { text, tags } = await req.json();

    if (!userId || !memoryId) {
        return NextResponse.json({ error: 'User ID and Memory ID are required' }, { status: 400 });
    }

    if (!text || !tags || tags.length < 3) {
        return NextResponse.json({ error: 'Memory text and at least 3 tags are required' }, { status: 400 });
    }

    try {
        // Update the memory by userId and memoryId
        const updatedMemory = await prisma.memory.update({
            where: {
                id: memoryId,
                userId: userId,
            },
            data: {
                data: { text, tags },   // Update the text and tags in the JSON field
            },
        });
        return NextResponse.json(updatedMemory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
    }
}