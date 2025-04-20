import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { CSVImporter } from '@/app/utils/csvImport';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!file.name.endsWith('.csv')) {
            return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
        }

        const content = await file.text();

        // Initialize CSV importer with options
        const importer = new CSVImporter({
            metadataFields: ['id', 'category', 'tags'] // Add any metadata fields you want to preserve
        });

        // Import the CSV
        const result = await importer.importCSV(content, session.user.id);

        return NextResponse.json({
            success: true,
            message: `Successfully imported ${result.data.length} records`,
            count: result.data.length,
            summary: result.summary
        });
    } catch (error) {
        console.error('Error importing CSV:', error);
        return NextResponse.json(
            { error: 'Failed to import CSV file' },
            { status: 500 }
        );
    }
} 