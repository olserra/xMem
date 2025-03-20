import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import crypto from 'crypto';

// Function to validate the API key and extract the userId
const getUserIdFromToken = async (token: string) => {
    const apiKey = await prisma.apiKey.findUnique({
        where: { key: token },
        include: { user: true },
    });
    return apiKey ? apiKey.userId : null;
};

export async function GET(req: Request, { params }: { params: { _dataId: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    try {
        const _data = await prisma._data.findUnique({
            where: { id: params._dataId },
        });
        if (!_data) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }
        if (_data.userId !== userId) {
            return NextResponse.json({ error: 'Not authorized to access this _data' }, { status: 403 });
        }

        return NextResponse.json(_data);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch _data' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { _dataId: string } }) {
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
        const _data = await prisma._data.findUnique({
            where: { id: params._dataId },
        });

        if (!_data) {
            return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
        }

        if (_data.userId !== userId) {
            return NextResponse.json({ error: 'Not authorized to update this _data' }, { status: 403 });
        }

        const updatedMemory = await prisma._data.update({
            where: { id: params._dataId },
            data: {
                content,
                updatedAt: new Date(),
                MemoryProject: projectId ? {
                    deleteMany: {},
                    create: {
                        id: `${crypto.randomUUID()}`,
                        projectId: projectId,
                        updatedAt: new Date()
                    }
                } : {
                    deleteMany: {}
                }
            },
            include: {
                MemoryProject: {
                    include: {
                        Project: true
                    }
                }
            }
        });

        return NextResponse.json(updatedMemory, { status: 200 });
    } catch (error) {
        console.error('Error updating _data:', error);
        return NextResponse.json({ error: 'Failed to update _data' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { _dataId: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { _dataId } = params; // Extract _dataId from the route

    try {
        const _data = await prisma._data.findUnique({
            where: { id: _dataId },
        });

        if (!_data || _data.userId !== userId) {
            return NextResponse.json({ error: 'Memory not found or user is not authorized' }, { status: 404 });
        }

        const deletedMemory = await prisma._data.delete({
            where: { id: _dataId },
        });

        return NextResponse.json(deletedMemory, { status: 200 });
    } catch (error) {
        console.error('Error deleting _data:', error);
        return NextResponse.json({ error: 'Failed to delete _data' }, { status: 500 });
    }
}
