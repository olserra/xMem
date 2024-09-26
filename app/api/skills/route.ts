import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Handle GET requests
export const GET = async (req: Request) => {
    try {
        // If no userId, fetch all available skills
        const skills = await prisma.skill.findMany();
        return NextResponse.json(skills); // Return all available skills

    } catch (error) {
        console.error('Error fetching skills or progress:', error);
        return NextResponse.json({ error: 'Failed to fetch skills or progress' }, { status: 500 });
    }
};