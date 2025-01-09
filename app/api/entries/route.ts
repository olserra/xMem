import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Fetch and store user entries (GET and POST requests)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const entries = await prisma.userData.findMany({
            where: { userId },
        });
        return NextResponse.json(entries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
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
        return NextResponse.json({ error: 'Entry text and at least 3 tags are required' }, { status: 400 });
    }

    try {
        const newEntry = await prisma.userData.create({
            data: {
                userId,
                data: { text, tags },   // Store the text and tags in a JSON field
            },
        });
        return NextResponse.json(newEntry, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const entryId = searchParams.get("entryId");

    if (!userId || !entryId) {
        return NextResponse.json({ error: 'User ID and Entry ID are required' }, { status: 400 });
    }

    try {
        // Delete the entry by userId and entryId
        const deletedEntry = await prisma.userData.delete({
            where: {
                id: entryId,
                userId: userId,
            },
        });
        return NextResponse.json(deletedEntry, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const entryId = searchParams.get("entryId");
    const { text, tags } = await req.json();

    if (!userId || !entryId) {
        return NextResponse.json({ error: 'User ID and Entry ID are required' }, { status: 400 });
    }

    if (!text || !tags || tags.length < 3) {
        return NextResponse.json({ error: 'Entry text and at least 3 tags are required' }, { status: 400 });
    }

    try {
        // Update the entry by userId and entryId
        const updatedEntry = await prisma.userData.update({
            where: {
                id: entryId,
                userId: userId,
            },
            data: {
                data: { text, tags },   // Update the text and tags in the JSON field
            },
        });
        return NextResponse.json(updatedEntry, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
    }
}