import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'POST':
            // Create a new Progress entry
            const { skillId, userId, currentProgress, status } = req.body;
            try {
                const progress = await prisma.progress.create({
                    data: { skillId, userId, currentProgress, status },
                });
                res.status(201).json(progress);
            } catch (error) {
                res.status(400).json({ error: 'Error creating progress entry' });
            }
            break;

        case 'GET':
            // Get all Progress entries for a specific User
            const { userId: queryUserId } = req.query;
            try {
                const progress = await prisma.progress.findMany({
                    where: { userId: queryUserId as string },
                });
                res.json(progress);
            } catch (error) {
                res.status(400).json({ error: 'Error fetching progress entries' });
            }
            break;

        case 'PUT':
            // Update a Progress entry
            const { id } = req.query;
            const { currentProgress: updatedProgress, status: updatedStatus } = req.body;
            try {
                const updatedEntry = await prisma.progress.update({
                    where: { id: id as string },
                    data: { currentProgress: updatedProgress, status: updatedStatus },
                });
                res.json(updatedEntry);
            } catch (error) {
                res.status(400).json({ error: 'Error updating progress entry' });
            }
            break;
    }
}
