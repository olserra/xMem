// app/api/skills/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // At this point, middleware has already validated the presence of userId
    // Optionally, you can perform additional validation if needed

    try {
        // Fetch all available skills
        const skills = await prisma.skill.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                category: true,
                labels: true,
                createdAt: true
            }
        });
        return NextResponse.json(skills); // Return all available skills

    } catch (error) {
        console.error('Error fetching skills:', error);
        return NextResponse.json({ error: 'Failed to fetch skills.' }, { status: 500 });
    }
};

// Handle POST requests
export const POST = async (req: Request) => {
    const { name, description, category, labels } = await req.json(); // Extract skill data from the request body

    // Extract userId from headers
    const userId = req.headers.get('userId');

    // Middleware has already validated the presence of userId
    // You can perform additional checks if necessary

    // Validate required fields
    if (!name || !description || !category || !Array.isArray(labels)) {
        return NextResponse.json(
            { error: 'name, description, category, and labels are required.' },
            { status: 400 }
        );
    }

    try {
        // Check if the skill already exists
        const existingSkill = await prisma.skill.findUnique({
            where: { name },
        });

        if (existingSkill) {
            return NextResponse.json(
                { error: 'Skill already exists.' },
                { status: 409 } // Conflict
            );
        }

        // Create the new skill
        const newSkill = await prisma.skill.create({
            data: {
                name,
                description,
                category,
                labels, // Assuming labels is an array of strings
            },
        });

        return NextResponse.json(newSkill, { status: 201 }); // Created
    } catch (error) {
        console.error('Error creating skill:', error);
        return NextResponse.json(
            { error: 'Failed to create skill.' },
            { status: 500 }
        );
    }
};