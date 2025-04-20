import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateDataAccess } from '@/app/helpers/dataHelpers';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await prisma.data.findUnique({
            where: { id: params.id },
        });

        if (!data) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        if (!validateDataAccess(data, session.user.id)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await prisma.data.findUnique({
            where: { id: params.id },
        });

        if (!data) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        if (!validateDataAccess(data, session.user.id)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const body = await req.json();
        const { content, type, projectId, metadata } = body;

        const updatedData = await prisma.data.update({
            where: { id: params.id },
            data: {
                ...(content && { content }),
                ...(type && { type }),
                ...(projectId && { projectId }),
                ...(metadata && { metadata }),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({ data: updatedData });
    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json(
            { error: 'Failed to update data' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await prisma.data.findUnique({
            where: { id: params.id },
        });

        if (!data) {
            return NextResponse.json({ error: 'Data not found' }, { status: 404 });
        }

        if (!validateDataAccess(data, session.user.id)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await prisma.data.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting data:', error);
        return NextResponse.json(
            { error: 'Failed to delete data' },
            { status: 500 }
        );
    }
} 