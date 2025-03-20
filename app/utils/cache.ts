import { CACHE_TTL, MAX_CACHE_SIZE } from '../constants';

export class Cache<T> {
    private cache: Map<string, T>;
    private maxSize: number;

    constructor(maxSize: number = 1000) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    get(key: string): T | null {
        return this.cache.get(key) || null;
    }

    set(key: string, value: T): void {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    has(key: string): boolean {
        return this.cache.has(key);
    }

    size(): number {
        return this.cache.size;
    }
}

export const dataCache = new Cache<any>(); // Cache for data objects
export const userCache = new Cache<any>(); // Cache for user objects
export const embedCache = new Cache<number[]>({ maxSize: 1000 }); // Cache for embeddings
export const mcpCache = new Cache<any>({ ttl: CACHE_TTL / 2 }); // Short-lived cache for MCP responses

// Helper functions for common caching patterns
export async function getCachedOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    cache: Cache<T> = dataCache,
    ttl?: number
): Promise<T> {
    const cached = cache.get<T>(key);
    if (cached !== null) {
        return cached;
    }

    const fresh = await fetchFn();
    cache.set(key, fresh, ttl);
    return fresh;
}

export function memoize<T>(
    fn: (...args: any[]) => Promise<T>,
    keyFn: (...args: any[]) => string = (...args) => JSON.stringify(args),
    cache: Cache<T> = dataCache
): (...args: any[]) => Promise<T> {
    return async (...args: any[]): Promise<T> => {
        const key = keyFn(...args);
        return getCachedOrFetch(key, () => fn(...args), cache);
    };
}

export function clearAllCaches(): void {
    dataCache.clear();
    embedCache.clear();
    mcpCache.clear();
} 