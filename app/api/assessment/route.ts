// app/api/assessment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Validate userId
    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required.' },
            { status: 400 }
        );
    }

    try {
        // Fetch the assessment data for the specified user
        const assessments = await prisma.assessment.findMany({
            where: { userId },
            select: {
                id: true,
                data: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (assessments.length === 0) {
            return NextResponse.json(
                { error: 'No assessment data found for this user.' },
                { status: 404 }
            );
        }

        return NextResponse.json(assessments, { status: 200 }); // Respond with the assessment data
    } catch (error) {
        console.error('Error fetching assessment data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch assessment data.' },
            { status: 500 }
        );
    }
};


export const POST = async (req: Request) => {
    const { userId, assessmentData } = await req.json();

    // Validate userId
    if (!userId) {
        return NextResponse.json(
            { error: 'userId is required.' },
            { status: 400 }
        );
    }

    // Validate assessment data
    if (!assessmentData || typeof assessmentData !== 'object') {
        return NextResponse.json(
            { error: 'Valid assessment data is required.' },
            { status: 400 }
        );
    }

    try {
        // Create a new assessment result
        const newAssessmentResult = await prisma.assessment.create({
            data: {
                userId,
                data: assessmentData,
            },
        });

        return NextResponse.json(newAssessmentResult, { status: 201 }); // Respond with the new assessment result
    } catch (error) {
        console.error('Error creating assessment result:', error);
        return NextResponse.json(
            { error: 'Failed to create assessment result.' },
            { status: 500 }
        );
    }
};
