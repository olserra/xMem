import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_QDRANT_URL || 'https://e1d45360-76fe-4a7b-b769-f59ced8c7b0f.eu-west-1-0.aws.cloud.qdrant.io:6333';
  const apiKey = process.env.NEXT_PUBLIC_QDRANT_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.eyIIvmECLQ7wy6H09Kx4xmWaD-gvr_VwEJr07bkiYw8';
  const collection = 'xmem_collection';
  const url = `${baseUrl.replace(/\/$/, '')}/collections/${collection}/points/scroll`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers['api-key'] = apiKey;

  const body = JSON.stringify({
    limit: 20,
    with_payload: true,
    with_vector: false,
    // Optionally, you could add sorting or filtering here
  });

  try {
    const res = await fetch(url, { method: 'POST', headers, body });
    const text = await res.text();
    if (res.ok) {
      const data = JSON.parse(text);
      // Map to a frontend-friendly format
      const queries = (data.result?.points || []).map((pt: any) => ({
        id: pt.id,
        ...pt.payload,
      }));
      return NextResponse.json({ queries });
    }
    return NextResponse.json({ queries: [] }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Qdrant queries' }, { status: 500 });
  }
} 