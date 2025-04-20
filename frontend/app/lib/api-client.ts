import { getSession } from 'next-auth/react'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const session = await getSession()
  
  const headers = {
    'Content-Type': 'application/json',
    ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BACKEND_URL}/api/v1${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new ApiError(response.status, error.detail || 'An error occurred')
  }

  return response.json()
}

export const apiClient = {
  data: {
    process: async (data: any) => {
      return fetchWithAuth('/data/process', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    search: async (query: string, limit = 10) => {
      return fetchWithAuth(`/data/search?query=${encodeURIComponent(query)}&limit=${limit}`)
    },
  },
  ml: {
    train: async (data: any) => {
      return fetchWithAuth('/ml/train', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    predict: async (data: any) => {
      return fetchWithAuth('/ml/predict', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },
  analysis: {
    generate: async (data: any) => {
      return fetchWithAuth('/analysis/generate', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },
} 