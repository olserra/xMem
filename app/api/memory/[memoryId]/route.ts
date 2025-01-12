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
    const { text, tags } = await req.json();
    if (!text || !tags || tags.length < 3) {
        return NextResponse.json({ error: 'Memory text and at least 3 tags are required' }, { status: 400 });
    }

    try {
        const updatedMemory = await prisma.memory.update({
            where: { id: params.memoryId },
            data: {
                data: { text, tags },
            },
        });
        return NextResponse.json(updatedMemory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update memory' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { memoryId: string } }) {
    try {
        const deletedMemory = await prisma.memory.delete({
            where: { id: params.memoryId },
        });
        return NextResponse.json(deletedMemory, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
    }
}
