import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const _data = await prisma._data.findUnique({
            where: {
                id: params.id,
                userId: session.user.id
            }
        });

        if (!_data) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }

        return NextResponse.json(_data);
    } catch (error) {
        console.error('Error fetching _data:', error);
        return NextResponse.json({ error: 'Failed to fetch _data' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, type, metadata } = body;

        const _data = await prisma._data.update({
            where: {
                id: params.id,
                userId: session.user.id
            },
            data: {
                content,
                type,
                metadata: {
                    ...metadata,
                    tags: metadata?.tags || []
                }
            }
        });

        return NextResponse.json(_data);
    } catch (error) {
        console.error('Error updating _data:', error);
        return NextResponse.json({ error: 'Failed to update _data' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma._data.delete({
            where: {
                id: params.id,
                userId: session.user.id
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting _data:', error);
        return NextResponse.json({ error: 'Failed to delete _data' }, { status: 500 });
    }
} 