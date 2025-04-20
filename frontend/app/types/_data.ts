export type DataType =
    | 'TEXT'           // Plain text content
    | 'CODE'           // Code snippets
    | 'DOCUMENT'       // Documents (PDF, DOC, etc.)
    | 'IMAGE'          // Images
    | 'URL'            // Web URLs
    | 'TASK'           // Task items
    | 'NOTE'           // Notes
    | 'CONTACT'        // Contact information
    | 'EVENT'          // Calendar events
    | 'BOOKMARK'       // Bookmarks
    | 'FILE'           // Generic files
    | 'DATABASE'       // Database records
    | 'API'            // API responses
    | 'CONFIG'         // Configuration data
    | 'LOG'            // Log entries
    | 'METRIC'         // Metrics and analytics
    | 'AUDIT'          // Audit logs
    | 'BACKUP'         // Backup data
    | 'ARCHIVE';       // Archived data

export interface DataMetadata {
    tags?: string[];
    source?: string;
    lastAccessed?: string;
    size?: number;
    mimeType?: string;
    version?: string;
    status?: 'active' | 'archived' | 'deleted';
    shared?: string[];
    custom?: Record<string, unknown>;
}

export interface Data {
    id: string;
    content: string;
    type: DataType;
    userId: string;
    projectId?: string;
    embedding?: number[];
    metadata?: DataMetadata;
    createdAt: string;
    updatedAt: string;
    version: number;
    isArchived: boolean;
} 