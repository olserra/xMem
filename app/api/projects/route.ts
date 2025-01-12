import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function POST(req: Request) {
    const { name, description, memoryTemplate } = await req.json();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!name || !description) {
        return NextResponse.json({ error: 'Project name and description are required' }, { status: 400 });
    }

    try {
        // Create the project
        const project = await prisma.project.create({
            data: {
                name,
                description,
                userId,
                visibility: 'private',
            },
        });

        // If a memory template is provided, create the memories
        if (memoryTemplate && Array.isArray(memoryTemplate)) {
            const memories = memoryTemplate.map((memory: any) => ({
                content: memory.content || '',
                type: memory.type || 'memory',
                metadata: memory.metadata || {},
                projectId: project.id,
            }));

            // Insert the memories into the database
            await prisma.memory.createMany({
                data: memories,
            });
        }

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const projectId = searchParams.get("projectId");

    try {
        if (projectId) {
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                },
                include: {
                    memories: true,
                    _count: {
                        select: { memories: true }
                    }
                }
            });
            return NextResponse.json(project);
        }

        const projects = await prisma.project.findMany({
            where: {
                userId,
            },
            include: {
                _count: {
                    select: { memories: true }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }
}