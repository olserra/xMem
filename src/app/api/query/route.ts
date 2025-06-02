import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    // TODO: Connect to LLM/vector search logic
    console.log('Re-run query:', query);
    return NextResponse.json({ status: 'ok', reply: `Mock response for: ${query}` });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: (err as Error).message }, { status: 400 });
  }
} 