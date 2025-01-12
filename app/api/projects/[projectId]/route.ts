import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: params.projectId },
        });
        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { projectId: string } }) {
    try {
        const { projectId } = params;
        const data = await req.json();

        const updatedProject = await prisma.project.update({
            where: { id: projectId },
            data: {
                name: data.name,
                description: data.description,
                visibility: data.visibility
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
    try {
        const deletedProject = await prisma.project.delete({
            where: { id: params.projectId },
        });
        return NextResponse.json(deletedProject, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
