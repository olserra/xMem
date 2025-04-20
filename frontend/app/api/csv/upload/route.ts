import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CSVImporter } from '@/app/utils/csvImport';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { data, userId } = body;

        if (!data || !Array.isArray(data)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        const importer = new CSVImporter();
        const result = await importer.importCSV(data[0].content, userId);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error importing data:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to import data' },
            { status: 500 }
        );
    }
} 