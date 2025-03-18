export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    metadata?: {
        count?: number;
        page?: number;
        totalPages?: number;
    };
} 