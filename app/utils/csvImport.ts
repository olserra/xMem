import { parse } from 'csv-parse/sync';
import { EmbeddingService } from '../services/embeddingService';
import { prisma } from '@/prisma/prisma';

interface CSVImportOptions {
    metadataFields?: string[];
}

interface ParsedRecord {
    content: string;
    metadata: Record<string, any>;
    summary?: string;
}

export class CSVImporter {
    private embedder: EmbeddingService;
    private metadataFields: string[];
    private defaultMetadataFields = ['title', 'category', 'tags', 'description', 'source', 'author', 'date'];

    constructor(options: CSVImportOptions = {}) {
        this.embedder = new EmbeddingService();
        this.metadataFields = options.metadataFields || this.defaultMetadataFields;
    }

    parseCSV(csvContent: string): ParsedRecord[] {
        // Parse CSV content
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        return records.map((record: any) => {
            // Extract metadata fields
            const metadata: Record<string, any> = {};
            this.metadataFields.forEach(field => {
                if (record[field]) {
                    if (field === 'tags' && typeof record[field] === 'string') {
                        metadata[field] = record[field].split(',').map(tag => tag.trim()).filter(Boolean);
                    } else {
                        metadata[field] = record[field];
                    }
                }
            });

            // Create content from non-metadata fields
            const contentFields = Object.entries(record)
                .filter(([key]) => !this.metadataFields.includes(key))
                .map(([key, value]) => ({ key, value }));

            // Format content in a structured way
            const content = contentFields
                .map(({ key, value }) => `${key}: ${value}`)
                .join('\n');

            // Create a summary from title and description, or first few content fields
            const summary = metadata.description ||
                metadata.title ||
                contentFields.slice(0, 2)
                    .map(({ value }) => value)
                    .join(' - ');

            return {
                content,
                metadata: {
                    ...metadata,
                    originalFields: Object.keys(record),
                    rowCount: contentFields.length
                },
                summary
            };
        });
    }

    async importCSV(csvContent: string, userId: string) {
        // Parse CSV content
        const records = this.parseCSV(csvContent);
        const importedData = [];

        // Process each record
        for (const record of records) {
            // Generate embedding
            const embedding = await this.embedder.generateEmbedding(record.content);

            // Store in PostgreSQL
            const dataEntry = await prisma.data.create({
                data: {
                    content: record.content,
                    type: 'TEXT',
                    userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    version: 1,
                    isArchived: false,
                    embedding: embedding,
                    metadata: {
                        source: 'csv',
                        summary: record.summary,
                        importedAt: new Date().toISOString(),
                        ...record.metadata,
                        displayConfig: {
                            showTitle: !!record.metadata.title,
                            showCategory: !!record.metadata.category,
                            showTags: Array.isArray(record.metadata.tags) && record.metadata.tags.length > 0,
                            showDescription: !!record.metadata.description,
                            layout: 'structured'
                        }
                    }
                }
            });
            importedData.push(dataEntry);
        }

        // Generate summary with type safety
        const categories = new Set<string>();
        const tags = new Set<string>();

        importedData.forEach(d => {
            const metadata = d.metadata as Record<string, any>;
            if (metadata?.category) {
                categories.add(String(metadata.category));
            }
            if (Array.isArray(metadata?.tags)) {
                metadata.tags.forEach((tag: string) => tags.add(tag));
            }
        });

        return {
            count: importedData.length,
            data: importedData,
            summary: {
                totalRecords: importedData.length,
                hasMetadata: importedData.some(d => Object.keys(d.metadata as Record<string, any>).length > 3),
                uniqueCategories: Array.from(categories),
                uniqueTags: Array.from(tags),
            }
        };
    }
} 