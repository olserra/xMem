import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { searchData } from '@/app/helpers/dataHelpers';
import { DataType, DataMetadata } from '@/app/types/_data';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { query, limit, filters } = await request.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // Fetch all data for the user
        const userData = await prisma.data.findMany({
            where: {
                userId: session.user.id,
                ...filters
            }
        });

        // Cast the type field to DataType and convert null values to undefined
        const typedData = userData.map(data => ({
            ...data,
            type: data.type as DataType,
            projectId: data.projectId || undefined,
            metadata: (data.metadata as DataMetadata) || undefined,
            createdAt: data.createdAt.toISOString(),
            updatedAt: data.updatedAt.toISOString()
        }));

        // Search through the data
        const results = await searchData(query, typedData, {
            limit: limit || 5,
            type: 'TEXT'
        });

        return NextResponse.json({
            success: true,
            results: results.map(doc => ({
                document: doc.content,
                metadata: doc.metadata,
                distance: doc.metadata?.custom?.relevance || 0
            }))
        });
    } catch (error) {
        console.error('Error searching CSV data:', error);
        return NextResponse.json(
            { error: 'Failed to search CSV data' },
            { status: 500 }
        );
    }
} 