import { UserSettings } from '../types';

// API Constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export const API_VERSION = 'v1';
export const API_TIMEOUT = 30000;

// Authentication Constants
export const AUTH_COOKIE_NAME = 'xmem_session';
export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
export const MAX_LOGIN_ATTEMPTS = 5;

// Project Constants
export const MAX_PROJECTS_PER_USER = 50;
export const MAX_PROJECT_NAME_LENGTH = 100;
export const MAX_PROJECT_DESCRIPTION_LENGTH = 500;
export const DEFAULT_PROJECT_TYPE = 'MEMORY';
export const DEFAULT_PROJECT_VISIBILITY = 'PRIVATE';

// Memory Constants
export const MAX_MEMORY_CONTENT_LENGTH = 10000;
export const MAX_MEMORIES_PER_PROJECT = 1000;
export const SUPPORTED_MEMORY_TYPES = ['TEXT', 'CODE', 'IMAGE', 'AUDIO', 'VIDEO'] as const;
export const DEFAULT_MEMORY_TYPE = 'TEXT';

// Embedding Constants
export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';
export const EMBEDDING_DIMENSIONS = 1536;
export const MAX_TOKENS_PER_REQUEST = 8000;

// UI Constants
export const ITEMS_PER_PAGE = 20;
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;
export const MAX_MOBILE_WIDTH = 768;

// Theme Constants
export const THEME_OPTIONS = ['light', 'dark', 'system'] as const;
export const DEFAULT_THEME = 'system';

// Cache Constants
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
export const MAX_CACHE_SIZE = 100;

// Rate Limiting
export const RATE_LIMIT_REQUESTS = 100;
export const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Error Messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'You must be logged in to perform this action',
    FORBIDDEN: 'You do not have permission to perform this action',
    NOT_FOUND: 'The requested resource was not found',
    VALIDATION_ERROR: 'Please check your input and try again',
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later',
} as const;

// Analytics Constants
export const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';
export const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID;

// Feature Flags
export const FEATURES = {
    TEAM_PROJECTS: process.env.NEXT_PUBLIC_FEATURE_TEAM_PROJECTS === 'true',
    ADVANCED_SEARCH: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_SEARCH === 'true',
    AI_SUGGESTIONS: process.env.NEXT_PUBLIC_FEATURE_AI_SUGGESTIONS === 'true',
    REAL_TIME_COLLAB: process.env.NEXT_PUBLIC_FEATURE_REAL_TIME_COLLAB === 'true',
} as const;

// Memory Storage Options
export const STORAGE_OPTIONS = {
    LOCAL: 'local',
    S3: 's3',
    REDIS: 'redis',
    HYBRID: 'hybrid',
} as const;

// Default Settings
export const DEFAULT_SETTINGS: UserSettings = {
    theme: 'system',
    language: 'en',
    notifications: true,
    embeddings: {
        model: DEFAULT_EMBEDDING_MODEL,
        dimensions: EMBEDDING_DIMENSIONS,
    },
} as const;

export const MAX_DATA_CONTENT_LENGTH = 1000000; // 1MB in characters

export const SUPPORTED_DATA_TYPES = [
    'TEXT',
    'CODE',
    'DOCUMENT',
    'IMAGE',
    'URL',
    'TASK',
    'NOTE',
    'CONTACT',
    'EVENT',
    'BOOKMARK',
    'FILE',
    'DATABASE',
    'API',
    'CONFIG',
    'LOG',
    'METRIC',
    'AUDIT',
    'BACKUP',
    'ARCHIVE'
] as const; 