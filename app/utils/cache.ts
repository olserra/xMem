import { CACHE_TTL, MAX_CACHE_SIZE } from '../constants';

interface CacheEntry<T> {
    value: T;
    timestamp: number;
    expiresAt: number;
}

interface CacheOptions {
    ttl?: number;
    maxSize?: number;
}

class Cache<T> {
    private cache: Map<string, CacheEntry<T>>;
    private ttl: number;
    private maxSize: number;

    constructor(options: CacheOptions = {}) {
        this.cache = new Map();
        this.ttl = options.ttl || CACHE_TTL;
        this.maxSize = options.maxSize || MAX_CACHE_SIZE;
    }

    set(key: string, value: T, customTtl?: number): void {
        this.cleanup();

        if (this.cache.size >= this.maxSize) {
            // Remove oldest entry
            const oldestKey = this.getOldestKey();
            if (oldestKey) {
                this.cache.delete(oldestKey);
            }
        }

        const now = Date.now();
        this.cache.set(key, {
            value,
            timestamp: now,
            expiresAt: now + (customTtl || this.ttl),
        });
    }

    get<R extends T = T>(key: string): R | null {
        this.cleanup();

        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.value as R;
    }

    has(key: string): boolean {
        this.cleanup();
        return this.cache.has(key);
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    size(): number {
        this.cleanup();
        return this.cache.size;
    }

    keys(): string[] {
        this.cleanup();
        return Array.from(this.cache.keys());
    }

    values(): T[] {
        this.cleanup();
        return Array.from(this.cache.values()).map(entry => entry.value);
    }

    entries(): [string, T][] {
        this.cleanup();
        return Array.from(this.cache.entries()).map(([key, entry]) => [key, entry.value]);
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }

    private getOldestKey(): string | null {
        let oldestKey: string | null = null;
        let oldestTimestamp = Infinity;

        for (const [key, entry] of this.cache.entries()) {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
                oldestKey = key;
            }
        }

        return oldestKey;
    }
}

// Create singleton instances for different types of caches
export const memoryCache = new Cache<any>({ ttl: CACHE_TTL * 2 }); // Cache for memory objects
export const projectCache = new Cache<any>(); // Cache for project objects
export const embedCache = new Cache<number[]>({ maxSize: 1000 }); // Cache for embeddings
export const mcpCache = new Cache<any>({ ttl: CACHE_TTL / 2 }); // Short-lived cache for MCP responses

// Helper functions for common caching patterns
export async function getCachedOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    cache: Cache<T> = memoryCache,
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
    cache: Cache<T> = memoryCache
): (...args: any[]) => Promise<T> {
    return async (...args: any[]): Promise<T> => {
        const key = keyFn(...args);
        return getCachedOrFetch(key, () => fn(...args), cache);
    };
}

export function clearAllCaches(): void {
    memoryCache.clear();
    projectCache.clear();
    embedCache.clear();
    mcpCache.clear();
} 