import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/prisma/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const subjects = await prisma.subject.findMany({
            include: {
                _count: {
                    select: { memories: true }
                }
            }
        });

        return NextResponse.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { name, description } = body;

        const subject = await prisma.subject.create({
            data: {
                name,
                description,
            },
        });

        return NextResponse.json(subject);
    } catch (error) {
        console.error('Error creating subject:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { id, name, description } = body;

        const subject = await prisma.subject.update({
            where: { id },
            data: {
                name,
                description,
            },
        });

        return NextResponse.json(subject);
    } catch (error) {
        console.error('Error updating subject:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Subject ID is required' }, { status: 400 });
        }

        await prisma.subject.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 