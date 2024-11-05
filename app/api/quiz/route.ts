import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function POST(req: Request) {
    const { userId, skillId, score, totalQuestions, name } = await req.json(); // Extract name from the request

    try {
        // Convert skillId to an integer
        const skillIdInt = parseInt(skillId, 10);
        if (isNaN(skillIdInt)) {
            return NextResponse.json({ error: 'Invalid skillId provided' }, { status: 400 });
        }

        // Validate the presence of name
        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // Save the quiz results in the Quiz model
        const quizResult = await prisma.quiz.create({
            data: {
                name, // Use the name from the request
                userId,
                skillId: skillIdInt, // Use the converted skillId
                score,
                totalQuestions,
            },
        });
        return NextResponse.json(quizResult, { status: 200 });
    } catch (error) {
        console.error('Error saving quiz results:', error);
        return NextResponse.json({ error: 'Error saving quiz results' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const quizzes = await prisma.quiz.findMany({
            where: { userId: userId },
            include: {
                skill: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { quizId } = await request.json();

    if (!quizId) {
        return NextResponse.json({ error: 'Quiz ID is required' }, { status: 400 });
    }

    try {
        const deletedQuiz = await prisma.quiz.delete({
            where: { id: quizId },
        });

        return NextResponse.json(deletedQuiz);
    } catch (error) {
        console.error('Error deleting quiz:', error);
        return NextResponse.json({ error: 'Failed to delete quiz' }, { status: 500 });
    }
}
