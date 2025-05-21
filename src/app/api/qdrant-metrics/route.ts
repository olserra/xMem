import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_QDRANT_URL || 'https://e1d45360-76fe-4a7b-b769-f59ced8c7b0f.eu-west-1-0.aws.cloud.qdrant.io:6333';
  const apiKey = process.env.NEXT_PUBLIC_QDRANT_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.eyIIvmECLQ7wy6H09Kx4xmWaD-gvr_VwEJr07bkiYw8';
  const collection = 'xmem_collection';
  const url = `${baseUrl.replace(/\/$/, '')}/collections/${collection}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['api-key'] = apiKey;

  try {
    const res = await fetch(url, { headers });
    const text = await res.text();
    if (res.ok) {
      const data = JSON.parse(text);
      if (data.result) {
        return NextResponse.json({
          points_count: data.result.points_count,
          indexed_vectors_count: data.result.indexed_vectors_count,
          segments_count: data.result.segments_count,
          optimizer_status: data.result.optimizer_status,
        });
      }
    }
    return NextResponse.json({}, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Qdrant metrics' }, { status: 500 });
  }
} 