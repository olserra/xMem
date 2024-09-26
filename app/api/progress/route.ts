import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

interface ProgressData {
    skillId: string;
    currentProgress: number;
    userId: string;
}

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        if (userId) {
            // If userId is provided, fetch user's progress entries
            const progressEntries = await prisma.progress.findMany({
                where: { userId },
                include: { skill: true },  // Include related skill data
            });
            return NextResponse.json(progressEntries); // Return user's skills with progress
        } else {
            // If no userId, fetch all available skills
            const skills = await prisma.skill.findMany();
            return NextResponse.json(skills); // Return all available skills
        }
    } catch (error) {
        console.error('Error fetching skills or progress:', error);
        return NextResponse.json({ error: 'Failed to fetch skills or progress' }, { status: 500 });
    }
};

// Handle POST requests for user progress
export const POST = async (req: Request) => {
    const { skillId, currentProgress, userId } = await req.json() as ProgressData;

    console.log(`Received request: skillId: ${skillId}, currentProgress: ${currentProgress}, userId: ${userId}`);

    // Validate required fields
    if (!skillId || typeof currentProgress !== 'number' || !userId) {
        return new Response(JSON.stringify({ error: 'skillId, currentProgress, and userId are required' }), { status: 400 });
    }

    try {
        // Check if the skill exists
        const skill = await prisma.skill.findUnique({
            where: { id: skillId },
        });

        if (!skill) {
            return new Response(JSON.stringify({ error: 'Skill not found' }), { status: 404 });
        }

        // Create the progress entry
        const newProgress = await prisma.progress.create({
            data: {
                skillId,
                currentProgress,
                userId,
            },
        });
        return new Response(JSON.stringify(newProgress), { status: 201 });
    } catch (error) {
        console.error('Error creating progress:', error);
        return new Response(JSON.stringify({ error: 'Failed to create progress' }), { status: 500 });
    }
};

// Handle PUT requests for updating progress
export const PUT = async (req: Request) => {
    const { id, currentProgress } = await req.json();

    if (!id || typeof currentProgress !== 'number') {
        return new Response(JSON.stringify({ error: 'ID and currentProgress are required' }), { status: 400 });
    }

    try {
        const updatedEntry = await prisma.progress.update({
            where: { id },
            data: { currentProgress },
        });
        return new Response(JSON.stringify(updatedEntry), { status: 200 });
    } catch (error) {
        console.error('Error updating progress:', error);
        return new Response(JSON.stringify({ error: 'Failed to update progress' }), { status: 500 });
    }
};

// Handle DELETE requests
export const DELETE = async (req: Request) => {
    const { progressId } = await req.json();

    if (!progressId) {
        return new Response(JSON.stringify({ error: 'Progress ID is required' }), { status: 400 });
    }

    try {
        await prisma.progress.delete({
            where: { id: progressId },
        });
        return new Response(null, { status: 204 }); // No content to send back
    } catch (error) {
        console.error('Error deleting progress:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete progress' }), { status: 500 });
    }
};
