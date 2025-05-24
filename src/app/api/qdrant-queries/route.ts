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
        // Return just the 'score' field (relevance score) from each payload, parsing as number if needed
        let scores = points
          .map((pt: { payload?: Record<string, unknown> }) => {
            const val = pt.payload?.score;
            if (typeof val === 'number') return val;
            if (typeof val === 'string' && !isNaN(Number(val))) return Number(val);
            return undefined;
          })
          .filter((n: unknown): n is number => typeof n === 'number' && !isNaN(n));
        // If all scores are 0 or in a very small range, try to rescale for better chart granularity
        if (scores.length > 0) {
          const min = Math.min(...scores);
          const max = Math.max(...scores);
          // Only rescale if all values are 0 or max-min is very small
          if (max === min) {
            // All values are the same, set to 50 for visibility
            scores = scores.map(() => 50);
          } else if (max <= 1) {
            // If scores are in [0,1], scale to [0,100]
            scores = scores.map(s => Math.round(s * 100));
          } else if (max <= 10) {
            // If scores are in [0,10], scale to [0,100]
            scores = scores.map(s => Math.round((s / 10) * 100));
          } else if (max <= 100 && min >= 0) {
            // If scores are in [0,100], keep as is
          } else {
            // Otherwise, normalize to [0,100]
            scores = scores.map(s => Math.round(((s - min) / (max - min)) * 100));
          }
        }
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