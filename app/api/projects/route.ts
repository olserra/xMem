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

export async function POST(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name || !description) {
        return NextResponse.json({
            error: 'Project name and description are required'
        }, { status: 400 });
    }

    try {
        // Create the project associated with the userId from the token
        const project = await prisma.project.create({
            data: {
                name,
                description,
                userId: userId,  // Use userId from the validated token
                visibility: 'private',
            },
        });

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Extract Bearer token

    if (!token) {
        return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    try {
        if (projectId) {
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    userId: userId, // Ensure the project belongs to the authenticated user
                },
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
        }

        const projects = await prisma.project.findMany({
            where: {
                userId: userId, // Fetch projects for the authenticated user
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
