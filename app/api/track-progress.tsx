// pages/api/track-progress.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { goal, current_progress, challenges, userId } = req.body;

        try {
            // Aqui você pode atualizar o progresso no banco de dados
            const updatedProgress = await prisma.progress.create({
                data: {
                    goal,
                    currentProgress: current_progress,
                    challenges: challenges.join(','), // ou como preferir
                    userId, // Vinculando o progresso ao usuário
                },
            });
            return res.status(201).json(updatedProgress);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to track progress' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
