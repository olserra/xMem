// pages/api/progress.ts
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

const progressHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log('Request:', req.method, req.body);

    switch (req.method) {
        case 'POST':
            const { skillId, currentProgress, userId } = req.body as ProgressData;
            if (!skillId || typeof currentProgress !== 'number' || !userId) {
                return sendErrorResponse(res, 'skillId, currentProgress, and userId are required', 400);
            }
            try {
                const newProgress = await prisma.progress.create({
                    data: {
                        skillId,
                        currentProgress,
                        userId,
                    },
                });
                console.log('New progress entry created:', newProgress);
                res.status(201).json(newProgress);
            } catch (error) {
                console.error('Error creating progress:', error);
                sendErrorResponse(res, 'Failed to create progress', 500);
            }
            break;

        case 'GET':
            const { userId: queryUserId } = req.query;
            if (!queryUserId) {
                return sendErrorResponse(res, 'User ID is required', 400);
            }
            try {
                const progressEntries = await prisma.progress.findMany({
                    where: { userId: queryUserId as string },
                    include: { skill: true },  // Optionally include related skill data
                });
                res.status(200).json(progressEntries);
            } catch (error) {
                sendErrorResponse(res, 'Failed to fetch progress', 500);
            }
            break;

        case 'PUT':
            const { id, updatedProgress } = req.body;
            if (!id || !updatedProgress) {
                return sendErrorResponse(res, 'ID and updatedProgress are required', 400);
            }
            try {
                const updatedEntry = await prisma.progress.update({
                    where: { id },
                    data: updatedProgress,
                });
                res.status(200).json(updatedEntry);
            } catch (error) {
                sendErrorResponse(res, 'Failed to update progress', 500);
            }
            break;

        case 'DELETE':
            const { progressId } = req.body;
            if (!progressId) {
                return sendErrorResponse(res, 'Progress ID is required', 400);
            }
            try {
                await prisma.progress.delete({
                    where: { id: progressId },
                });
                res.status(204).end(); // No content to send back
            } catch (error) {
                sendErrorResponse(res, 'Failed to delete progress', 500);
            }
            break;

        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
            break;
    }
};

export default progressHandler;
