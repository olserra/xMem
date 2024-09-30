// app/api/assessment/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

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
