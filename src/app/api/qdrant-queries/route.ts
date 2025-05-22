import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_QDRANT_URL;
  if (!baseUrl) {
    return NextResponse.json({ error: 'Qdrant URL is not defined' }, { status: 500 });
  }
  const apiKey = process.env.NEXT_PUBLIC_QDRANT_API_KEY;
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

  const { searchParams } = new URL(req.url);
  const relevanceOnly = searchParams.get('relevanceOnly') === 'true';

  try {
    const res = await fetch(url, { method: 'POST', headers, body });
    const text = await res.text();
    if (res.ok) {
      const data = JSON.parse(text);
      const points: Array<{ id: string | number; payload?: Record<string, unknown> }> = data.result?.points || [];
      if (relevanceOnly) {
        // Return just the 'number' field (relevance score) from each payload
        const scores = points
          .map((pt: { payload?: Record<string, unknown> }) => pt.payload?.number)
          .filter((n: unknown): n is number => typeof n === 'number');
        return NextResponse.json({ scores });
      }
      // Map to a frontend-friendly format
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
} 