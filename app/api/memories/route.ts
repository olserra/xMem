import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const tags = searchParams.get('tags')?.split(',') || [];
        const search = searchParams.get('search') || '';

        const data = await prisma._data.findMany({
            where: {
                userId: session.user.id,
                ...(tags.length > 0 && {
                    metadata: {
                        path: ['tags'],
                        array_contains: tags
                    }
                }),
                ...(search && {
                    content: {
                        contains: search,
                        mode: 'insensitive'
                    }
                })
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { content, type, metadata } = body;

        const _data = await prisma._data.create({
            data: {
                content,
                type: type || 'TEXT',
                userId: session.user.id,
                metadata: {
                    ...metadata,
                    tags: metadata?.tags || []
                }
            }
        });

        return NextResponse.json(_data);
    } catch (error) {
        console.error('Error creating _data:', error);
        return NextResponse.json({ error: 'Failed to create _data' }, { status: 500 });
    }
} 