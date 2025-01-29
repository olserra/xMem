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

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    try {
        const project = await prisma.project.findUnique({
            where: { id: params.projectId, userId: userId }, // Ensure the project belongs to the authenticated user
            include: {
                memories: true,
                _count: {
                    select: { memories: true }
                }
            }
        });

        if (!project) {
            return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { projectId: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    try {
        const { name, description, visibility } = await req.json();

        const updatedProject = await prisma.project.update({
            where: { id: params.projectId, userId: userId },
            data: {
                name,
                description,
                visibility,
                updatedAt: new Date(),
            },
            include: {
                memories: true,
                _count: {
                    select: { memories: true }
                }
            }
        });

        return NextResponse.json(updatedProject);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update project' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    try {
        const deletedProject = await prisma.project.delete({
            where: { id: params.projectId, userId: userId },
        });
        return NextResponse.json(deletedProject, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
