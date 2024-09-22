// pages/api/progress.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/prisma/prisma';

const progressHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            // Create a new progress entry
            const { skillId, currentProgress, status, user_id } = req.body;
            try {
                const newProgress = await prisma.progress.create({
                    data: {
                        skillId,
                        currentProgress,
                        status,
                        userId: user_id,
                    },
                });
                console.log('New progress entry created:', newProgress);
                res.status(201).json(newProgress);
            } catch (error) {
                console.error('Error creating progress:', error);
                res.status(500).json({ error: 'Failed to create progress' });
            }
            break;

        case 'GET':
            // Fetch all progress entries for a specific user
            const { userId } = req.query;
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
                return;
            }

            try {
                const progressEntries = await prisma.progress.findMany({
                    where: { userId: userId as string },
                });
                res.status(200).json(progressEntries);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch progress' });
            }
            break;

        case 'PUT':
            // Update an existing progress entry
            const { id, updatedProgress } = req.body;
            try {
                const updatedEntry = await prisma.progress.update({
                    where: { id },
                    data: updatedProgress,
                });
                res.status(200).json(updatedEntry);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update progress' });
            }
            break;

        case 'DELETE':
            // Delete a progress entry
            const { progressId } = req.body;
            try {
                await prisma.progress.delete({
                    where: { id: progressId },
                });
                res.status(204).end(); // No content to send back
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete progress' });
            }
            break;

        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
};

export default progressHandler;
