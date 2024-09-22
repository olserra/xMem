import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    const { user_id } = req.query; // Get the user_id from the URL

    switch (method) {
        case 'POST':
            // Create a new Progress entry for a specific user
            const { skillId, currentProgress, status } = req.body;
            try {
                const progress = await prisma.progress.create({
                    data: { skillId, userId: user_id as string, currentProgress, status },
                });
                res.status(201).json(progress);
            } catch (error) {
                res.status(400).json({ error: 'Error creating progress entry' });
            }
            break;

        case 'GET':
            // Get all Progress entries for a specific User from the URL
            try {
                const progress = await prisma.progress.findMany({
                    where: { userId: user_id as string },
                });
                res.status(200).json(progress);
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
                res.status(200).json(updatedEntry);
            } catch (error) {
                res.status(400).json({ error: 'Error updating progress entry' });
            }
            break;

        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}
