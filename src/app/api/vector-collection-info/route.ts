import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { vectorDbUrl, apiKey, type, collection } = await req.json();
    if (!vectorDbUrl || !type) {
      return NextResponse.json({ error: 'Missing vectorDbUrl or type' }, { status: 400 });
    }
    const baseUrl = vectorDbUrl.replace(/\/$/, '');
    let url = '';
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    let metrics = {};

    if (type === 'qdrant' || vectorDbUrl.toLowerCase().includes('qdrant')) {
      if (apiKey) headers['api-key'] = apiKey;
      const coll = collection || 'xmem_collection';
      url = `${baseUrl}/collections/${coll}`;
      let res = await fetch(url, { headers });
      let text = await res.text();
      if (res.ok) {
        const data = JSON.parse(text);
        if (data.result) {
          metrics = {
            points_count: data.result.points_count,
            indexed_vectors_count: data.result.indexed_vectors_count,
            segments_count: data.result.segments_count,
            optimizer_status: data.result.optimizer_status,
          };
          return NextResponse.json(metrics);
        }
      }
      // fallback to all collections if not found
      if (res.status === 404) {
        url = `${baseUrl}/collections`;
        res = await fetch(url, { headers });
        text = await res.text();
        if (!res.ok) return NextResponse.json({ error: 'Failed to fetch Qdrant collections' }, { status: 500 });
        const data = JSON.parse(text);
        if (Array.isArray(data.result)) {
          const total = data.result.reduce((acc: number, c: { vectors_count?: number }) => acc + (c.vectors_count || 0), 0);
          metrics = { points_count: total };
          return NextResponse.json(metrics);
        }
      }
      return NextResponse.json({ error: `Qdrant error: ${res.status} ${text}` }, { status: res.status });
    } else if (type === 'chromadb' || vectorDbUrl.toLowerCase().includes('chroma')) {
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
      url = `${baseUrl}/api/v1/collections`;
      const res = await fetch(url, { headers });
      const text = await res.text();
      if (!res.ok) return NextResponse.json({ error: 'Failed to fetch ChromaDB collections' }, { status: res.status });
      const data = JSON.parse(text);
      if (Array.isArray(data) && data.length > 0) {
        const total = data.reduce((acc: number, c: { size?: number }) => acc + (c.size || 0), 0);
        metrics = { points_count: total };
        return NextResponse.json(metrics);
      }
      return NextResponse.json({ error: 'No collections found in ChromaDB' }, { status: 404 });
    } else {
      return NextResponse.json({ error: 'Unsupported vector DB type' }, { status: 400 });
    }
  } catch (err: unknown) {
    let errorMessage = 'Unknown error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 