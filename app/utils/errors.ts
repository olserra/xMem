import { ERROR_MESSAGES } from '../constants';
import { analytics } from './analytics';

export class AppError extends Error {
    public code: string;
    public statusCode: number;
    public context?: any;

    constructor(
        message: string,
        code: string = 'INTERNAL_ERROR',
        statusCode: number = 500,
        context?: any
    ) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.context = context;
    }
}

export class ValidationError extends AppError {
    constructor(message: string, context?: any) {
        super(message, 'VALIDATION_ERROR', 400, context);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED, context?: any) {
        super(message, 'AUTHENTICATION_ERROR', 401, context);
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = ERROR_MESSAGES.FORBIDDEN, context?: any) {
        super(message, 'AUTHORIZATION_ERROR', 403, context);
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = ERROR_MESSAGES.NOT_FOUND, context?: any) {
        super(message, 'NOT_FOUND', 404, context);
        this.name = 'NotFoundError';
    }
}

export class RateLimitError extends AppError {
    constructor(message: string = ERROR_MESSAGES.RATE_LIMIT_EXCEEDED, context?: any) {
        super(message, 'RATE_LIMIT_EXCEEDED', 429, context);
        this.name = 'RateLimitError';
    }
}

export function isAppError(error: any): error is AppError {
    return error instanceof AppError;
}

export async function handleError(error: any, userId?: string): Promise<AppError> {
    // Convert unknown errors to AppError
    const appError = isAppError(error)
        ? error
        : new AppError(
            error.message || ERROR_MESSAGES.SERVER_ERROR,
            'INTERNAL_ERROR',
            500,
            { originalError: error }
        );

    // Track error in analytics
    await analytics.trackError(appError, appError.context, userId);

    // Log error details
    console.error('Error:', {
        name: appError.name,
        message: appError.message,
        code: appError.code,
        statusCode: appError.statusCode,
        context: appError.context,
        stack: appError.stack,
    });

    return appError;
}

export function createErrorResponse(error: any) {
    const appError = isAppError(error) ? error : new AppError(error.message || ERROR_MESSAGES.SERVER_ERROR);

    return {
        success: false,
        error: {
            message: appError.message,
            code: appError.code,
            context: appError.context,
        },
        statusCode: appError.statusCode,
    };
}

export function validateRequired<T extends object>(
    data: T,
    requiredFields: (keyof T)[]
): void {
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        throw new ValidationError(`Missing required fields: ${missingFields.join(', ')}`);
    }
}

export function validateType<T>(
    value: any,
    type: string,
    fieldName: string
): void {
    const actualType = typeof value;
    if (actualType !== type) {
        throw new ValidationError(
            `Invalid type for ${fieldName}. Expected ${type}, got ${actualType}`
        );
    }
}

export function validateEnum<T>(
    value: any,
    enumValues: T[],
    fieldName: string
): void {
    if (!enumValues.includes(value)) {
        throw new ValidationError(
            `Invalid value for ${fieldName}. Must be one of: ${enumValues.join(', ')}`
        );
    }
}

export function validateLength(
    value: string,
    min: number,
    max: number,
    fieldName: string
): void {
    if (value.length < min || value.length > max) {
        throw new ValidationError(
            `${fieldName} must be between ${min} and ${max} characters`
        );
    }
}

export function validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email address');
    }
} 