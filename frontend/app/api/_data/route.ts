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

        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Read the file content
        const csvContent = await file.text();

        // Initialize CSV importer
        const importer = new CSVImporter({
            collectionName: `csv_${session.user.id}`,
            metadataFields: ['title', 'category', 'tags'] // Add any metadata fields you want to extract
        });

        // Import the CSV
        const result = await importer.importCSV(csvContent, session.user.id);

        return NextResponse.json({
            message: 'CSV imported successfully',
            count: result.count,
            collectionName: result.collectionName
        });
    } catch (error: any) {
        console.error('Error importing CSV:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to import CSV' },
            { status: 500 }
        );
    }
} 