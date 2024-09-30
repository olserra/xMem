import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        if (userId) {
            // Fetch user's progress entries
            const progressEntries = await prisma.progress.findMany({
                where: { userId },
                include: { skill: true },
            });
            return NextResponse.json(progressEntries, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        } else {
            // Fetch all available skills
            const skills = await prisma.skill.findMany();
            return NextResponse.json(skills, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }
    } catch (error) {
        console.error('Error fetching skills or progress:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills or progress' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
};

// Handle POST requests for user progress
export const POST = async (req: Request) => {
    const { skillId, currentProgress, userId } = await req.json();

    if (!skillId || typeof currentProgress !== 'number' || !userId) {
        return NextResponse.json(
            { error: 'skillId, currentProgress, and userId are required' },
            {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }

    try {
        // Check if the skill exists
        const skill = await prisma.skill.findUnique({
            where: { id: skillId },
        });

        if (!skill) {
            return NextResponse.json(
                { error: 'Skill not found' },
                {
                    status: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    },
                }
            );
        }

        // Create the progress entry
        const newProgress = await prisma.progress.create({
            data: {
                skillId,
                currentProgress,
                userId,
            },
        });
        return NextResponse.json(newProgress, {
            status: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        console.error('Error creating progress:', error);
        return NextResponse.json(
            { error: 'Failed to create progress' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
};

// Handle PUT requests for updating progress
export const PUT = async (req: Request) => {
    const { id, currentProgress } = await req.json();

    if (!id || typeof currentProgress !== 'number') {
        return NextResponse.json(
            { error: 'ID and currentProgress are required' },
            {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }

    try {
        const updatedEntry = await prisma.progress.update({
            where: { id },
            data: { currentProgress },
        });
        return NextResponse.json(updatedEntry, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        console.error('Error updating progress:', error);
        return NextResponse.json(
            { error: 'Failed to update progress' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
};

// Handle DELETE requests
export const DELETE = async (req: Request) => {
    const { progressId } = await req.json();

    if (!progressId) {
        return NextResponse.json(
            { error: 'Progress ID is required' },
            {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }

    try {
        await prisma.progress.delete({
            where: { id: progressId },
        });
        return NextResponse.json(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        console.error('Error deleting progress:', error);
        return NextResponse.json(
            { error: 'Failed to delete progress' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
};

// Handle OPTIONS requests (CORS preflight)
export const OPTIONS = async () => {
    return NextResponse.json(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
};
