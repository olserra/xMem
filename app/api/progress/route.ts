import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/prisma';

interface ProgressData {
    skillId: string;
    currentProgress: number;
    userId: string;  // Changed from user_id to userId for consistency
}

const sendErrorResponse = (res: NextApiResponse, message: string, statusCode: number) => {
    res.status(statusCode).json({ error: message });
};

// Handle POST requests
export const POST = async (req: Request) => {
    const { skillId, currentProgress, userId } = await req.json() as ProgressData;
    console.log('Received POST data:', { skillId, currentProgress, userId });

    // Validate required fields
    if (!skillId || typeof currentProgress !== 'number' || !userId) {
        return new Response(JSON.stringify({ error: 'skillId, currentProgress, and userId are required' }), { status: 400 });
    }

    try {
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

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
    }

    try {
        const progressEntries = await prisma.progress.findMany({
            where: { userId },
            include: { skill: true },  // Optionally include related skill data
        });
        return new Response(JSON.stringify(progressEntries), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch progress' }), { status: 500 });
    }
};

// Handle PUT requests
export const PUT = async (req: Request) => {
    const { id, updatedProgress } = await req.json();

    if (!id || !updatedProgress) {
        return new Response(JSON.stringify({ error: 'ID and updatedProgress are required' }), { status: 400 });
    }

    try {
        const updatedEntry = await prisma.progress.update({
            where: { id },
            data: updatedProgress,
        });
        return new Response(JSON.stringify(updatedEntry), { status: 200 });
    } catch (error) {
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
        return new Response(JSON.stringify({ error: 'Failed to delete progress' }), { status: 500 });
    }
};
