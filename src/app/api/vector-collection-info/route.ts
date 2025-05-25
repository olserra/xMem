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
        try {
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
        } catch {}
      }
      // fallback to all collections if not found
      if (res.status === 404) {
        url = `${baseUrl}/collections`;
        res = await fetch(url, { headers });
        text = await res.text();
        if (!res.ok) return NextResponse.json({ error: 'Failed to fetch Qdrant collections', raw: text }, { status: 500 });
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data.result)) {
            const total = data.result.reduce((acc: number, c: { vectors_count?: number }) => acc + (c.vectors_count || 0), 0);
            metrics = { points_count: total };
            return NextResponse.json(metrics);
          }
        } catch {}
      }
      return NextResponse.json({ error: `Qdrant error: ${res.status}`, raw: text }, { status: res.status });
    } else if (type === 'chromadb' || vectorDbUrl.toLowerCase().includes('chroma')) {
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
      url = `${baseUrl}/api/v1/collections`;
      const res = await fetch(url, { headers });
      const text = await res.text();
      if (!res.ok) return NextResponse.json({ error: 'Failed to fetch ChromaDB collections', raw: text }, { status: res.status });
      try {
        const data = JSON.parse(text);
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((acc: number, c: { size?: number }) => acc + (c.size || 0), 0);
          metrics = { points_count: total };
          return NextResponse.json(metrics);
        }
      } catch {}
      return NextResponse.json({ error: 'No collections found in ChromaDB', raw: text }, { status: 404 });
    } else if (type === 'pinecone' || vectorDbUrl.toLowerCase().includes('pinecone')) {
      if (!apiKey) return NextResponse.json({ error: 'Missing Pinecone API key' }, { status: 400 });
      url = `${baseUrl}/describe_index_stats`;
      const headersPinecone = { 'Content-Type': 'application/json', 'Api-Key': apiKey };
      const res = await fetch(url, { method: 'POST', headers: headersPinecone });
      const text = await res.text();
      if (!res.ok) return NextResponse.json({ error: 'Failed to fetch Pinecone stats', raw: text, debug: { url, headers: headersPinecone, status: res.status } }, { status: res.status });
      try {
        const data = JSON.parse(text);
        metrics = { points_count: data.totalVectorCount };
        return NextResponse.json(metrics);
      } catch {}
    } else if (type === 'mongodb' || vectorDbUrl.toLowerCase().includes('mongodb')) {
      return NextResponse.json({ points_count: 0 }, { status: 200 });
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