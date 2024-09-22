// pages/api/set-goal.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { goal, deadline, steps, userId } = req.body;

        try {
            // Aqui você pode salvar a meta no banco de dados
            const newGoal = await prisma.goal.create({
                data: {
                    goal,
                    deadline: new Date(deadline),
                    steps: steps.join(', '), // ou como você preferir armazenar
                    userId, // Vinculando a meta ao usuário
                },
            });
            return res.status(201).json(newGoal);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to create goal' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
