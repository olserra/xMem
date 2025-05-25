import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const relevanceOnly = searchParams.get('relevanceOnly') === 'true';
  const collection = searchParams.get('collection') || 'xmem_collection';
  const vectorDbUrl = searchParams.get('vectorDbUrl');
  const apiKey = searchParams.get('apiKey');
  const type = searchParams.get('type');

  // Default to Qdrant env vars if not provided
  const baseUrl = vectorDbUrl || process.env.NEXT_PUBLIC_QDRANT_URL;
  const key = apiKey || process.env.NEXT_PUBLIC_QDRANT_API_KEY;
  const dbType = type || 'qdrant';

  if (!baseUrl) {
    return NextResponse.json({ error: 'Vector DB URL is not defined' }, { status: 500 });
  }

  let url = '';
  let headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (key) headers['api-key'] = key;
  let body = "";

  if (dbType === 'qdrant' || baseUrl.toLowerCase().includes('qdrant')) {
    url = `${baseUrl.replace(/\/$/, '')}/collections/${collection}/points/scroll`;
    body = JSON.stringify({
      limit: 20,
      with_payload: true,
      with_vector: false,
    });
    try {
      const res = await fetch(url, { method: 'POST', headers, body });
      const text = await res.text();
      if (res.ok) {
        const data: { result?: { points?: Array<{ id: string | number; payload?: Record<string, unknown> }> } } = JSON.parse(text);
        const points = data.result?.points ?? [];
        if (relevanceOnly) {
          let scores = points
            .map((pt: { payload?: Record<string, unknown> }) => {
              const val = pt.payload?.score;
              if (typeof val === 'number') return val;
              if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
              return undefined;
            })
            .filter((n): n is number => typeof n === 'number' && !isNaN(n));
          if (scores.length > 0) {
            const min = Math.min(...scores);
            const max = Math.max(...scores);
            if (max === min) {
              scores = scores.map(() => 50);
            } else if (max <= 1) {
              scores = scores.map(s => Math.round(s * 100));
            } else if (max <= 10) {
              scores = scores.map(s => Math.round((s / 10) * 100));
            } else if (max <= 100 && min >= 0) {
            } else {
              scores = scores.map(s => Math.round(((s - min) / (max - min)) * 100));
            }
          }
          return NextResponse.json({ scores });
        }
        const queries = points.map((pt: { id: string | number; payload?: Record<string, unknown> }) => ({
          id: pt.id,
          ...pt.payload,
        }));
        return NextResponse.json({ queries });
      }
      return NextResponse.json({ queries: [] }, { status: 404 });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch Qdrant queries' }, { status: 500 });
    }
  } else if (dbType === 'pinecone' || baseUrl.toLowerCase().includes('pinecone')) {
    // Pinecone: fetch recent vectors (mock relevance scores from metadata.score)
    url = `${baseUrl.replace(/\/$/, '')}/vectors/fetch`;
    headers = { 'Content-Type': 'application/json', 'Api-Key': key || "" };
    body = JSON.stringify({ ids: Array.from({ length: 20 }, (_, i) => `mock-${i + 1}`), namespace: 'default' });
    try {
      console.log('Pinecone fetch debug:', { url, headers, body });
      const res = await fetch(url, { method: 'POST', headers, body });
      const text = await res.text();
      console.log('Pinecone fetch response:', { status: res.status, body: text });
      if (res.ok) {
        const data = JSON.parse(text);
        const vectors = Object.values(data.vectors || {}) as Array<{ id: string; metadata?: Record<string, unknown> }>;
        if (relevanceOnly) {
          let scores = vectors
            .map((v: { id: string; metadata?: Record<string, unknown> }) => {
              const val = v.metadata?.score;
              if (typeof val === 'number') return val;
              if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
              return undefined;
            })
            .filter((n): n is number => typeof n === 'number' && !isNaN(n));
          if (scores.length > 0) {
            const min = Math.min(...scores);
            const max = Math.max(...scores);
            if (max === min) {
              scores = scores.map(() => 50);
            } else if (max <= 1) {
              scores = scores.map(s => Math.round(s * 100));
            } else if (max <= 10) {
              scores = scores.map(s => Math.round((s / 10) * 100));
            } else if (max <= 100 && min >= 0) {
            } else {
              scores = scores.map(s => Math.round(((s - min) / (max - min)) * 100));
            }
          }
          return NextResponse.json({ scores });
        }
        const queries = vectors.map((v: { id: string; metadata?: Record<string, unknown> }) => ({ id: v.id, ...v.metadata }));
        return NextResponse.json({ queries });
      }
      return NextResponse.json({ queries: [] }, { status: 404 });
    } catch {
      console.error('Error fetching Pinecone vectors');
      return NextResponse.json({ error: 'Failed to fetch Pinecone vectors' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Unsupported vector DB type for relevance chart' }, { status: 400 });
  }
} 