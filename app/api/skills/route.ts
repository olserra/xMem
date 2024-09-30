// app/api/skills/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Handle GET requests
// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Validate userId to ensure it is not null
    if (!userId) {
        return NextResponse.json(
            { error: 'userId query parameter is required.' },
            { status: 400 } // Bad request
        );
    }

    // Log the userId for monitoring
    console.log(`Fetching skills for user ID: ${userId}`);

    try {
        // Optional: Check if the user exists
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 } // Not found
            );
        }

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

    // Validate userId
    if (!userId) {
        return NextResponse.json(
            { error: 'API error: userId header is required.' },
            { status: 400 }
        );
    }

    // Validate required fields
    if (!name || !description || !category || !Array.isArray(labels)) {
        return NextResponse.json(
            { error: 'name, description, category, and labels are required.' },
            { status: 400 }
        );
    }

    try {
        // Check if the user exists
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 } // Not found
            );
        }

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
                // Optionally link to user if your data model supports this
                // userId: userId, // Uncomment if you have a userId field in your Skill model
            },
        });

        // Log the action or perform user-specific logic
        console.log(`User ${userId} created a new skill: ${name}`);

        return NextResponse.json(newSkill, { status: 201 }); // Created
    } catch (error) {
        console.error('Error creating skill:', error);
        return NextResponse.json(
            { error: 'Failed to create skill.' },
            { status: 500 }
        );
    }
};
