import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { queryId, rating, comments } = await req.json();
    // TODO: Store feedback in DB or analytics
    console.log('Feedback received:', { queryId, rating, comments });
    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: (err as Error).message }, { status: 400 });
  }
} 