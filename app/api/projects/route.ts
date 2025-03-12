import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Function to validate the API key and extract the userId
const getUserIdFromToken = async (token: string) => {
    const apiKey = await prisma.apiKey.findUnique({
        where: { key: token },
        include: { user: true },
    });
    return apiKey ? apiKey.userId : null;
};

export async function POST(req: Request) {
    let userId: string | null = null;
    const { name, description } = await req.json();

    // Check if this is an API request with a bearer token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (token) {
        userId = await getUserIdFromToken(token);
    } else {
        // For web requests, get the session
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });
            userId = user?.id || null;
        }
    }

    // Handle unauthorized access
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate required fields
    if (!name || !description) {
        return NextResponse.json({
            error: 'Project name and description are required'
        }, { status: 400 });
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

        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    let userId: string | null = null;

    // Check if this is an API request with a bearer token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (token) {
        userId = await getUserIdFromToken(token);
    } else {
        // For web requests, get the session
        const session = await getServerSession(authOptions);
        if (session?.user?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });
            userId = user?.id || null;
        }
    }

    // Handle unauthorized access
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    try {
        if (projectId) {
            const project = await prisma.project.findUnique({
                where: {
                    id: projectId,
                    userId,
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
