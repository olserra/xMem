import { useCallback } from 'react';
import { API_BASE_URL, API_TIMEOUT, ERROR_MESSAGES } from '../constants';
import { ApiResponse } from '../types';

interface RequestOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
}

export function useApi(bearerToken: string | null) {
    const fetchWithTimeout = useCallback(async (
        url: string,
        options: RequestOptions = {}
    ) => {
        const { timeout = API_TIMEOUT } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            // Include bearer token in headers if available
            const headers = {
                'Content-Type': 'application/json',
                ...(bearerToken && { 'Authorization': `Bearer ${bearerToken}` }),
                ...options.headers,
            };

            console.log('Making API request to:', url, 'with options:', {
                ...options,
                headers,
            });

            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers,
            });

            clearTimeout(id);

            if (!response.ok) {
                const error = await response.json();
                console.error('API request failed:', {
                    status: response.status,
                    error,
                    bearerToken: bearerToken ? 'present' : 'missing'
                });
                throw new Error(error.message || ERROR_MESSAGES.SERVER_ERROR);
            }

            const data = await response.json();
            console.log('API request successful:', {
                data,
                bearerToken: bearerToken ? 'present' : 'missing'
            });
            return {
                success: true,
                data,
                error: undefined
            };
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        }
    }, [bearerToken]);

    const get = useCallback(async <T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> => {
        const url = `${API_BASE_URL}${endpoint}`;
        return fetchWithTimeout(url, {
            ...options,
            method: 'GET',
        });
    }, [fetchWithTimeout]);

    const post = useCallback(async <T>(
        endpoint: string,
        data: any,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> => {
        const url = `${API_BASE_URL}${endpoint}`;
        return fetchWithTimeout(url, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }, [fetchWithTimeout]);

    const put = useCallback(async <T>(
        endpoint: string,
        data: any,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> => {
        const url = `${API_BASE_URL}${endpoint}`;
        return fetchWithTimeout(url, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }, [fetchWithTimeout]);

    const del = useCallback(async <T>(
        endpoint: string,
        options: RequestOptions = {}
    ): Promise<ApiResponse<T>> => {
        const url = `${API_BASE_URL}${endpoint}`;
        return fetchWithTimeout(url, {
            ...options,
            method: 'DELETE',
        });
    }, [fetchWithTimeout]);

    return {
        get,
        post,
        put,
        del,
    };
} 