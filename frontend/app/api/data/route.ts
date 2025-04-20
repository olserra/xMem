import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateRequired } from '@/app/utils/errors';
import { createData } from '@/app/helpers/dataHelpers';

let sessionCache = new Map<string, { userId: string; expires: Date }>();

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const searchParams = req.nextUrl.searchParams;
        const type = searchParams.get('type');
        const projectId = searchParams.get('projectId');

        const where = {
            userId: session.user.id,
            ...(type && { type }),
            ...(projectId && { projectId }),
            isArchived: false,
        };

        const data = await prisma.data.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { content, type, projectId, metadata } = body;

        validateRequired({ content, type }, ['content', 'type']);

        const data = await createData(
            content,
            type,
            session.user.id,
            projectId,
            metadata
        );

        const savedData = await prisma.data.create({
            data
        });

        return NextResponse.json({ data: savedData });
    } catch (error: any) {
        console.error('Error creating data:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create data' },
            { status: 500 }
        );
    }
} 