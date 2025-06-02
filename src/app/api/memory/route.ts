import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    if (action === 'delete') {
      // TODO: Connect to vector DB delete logic
      console.log('Delete memory:', data);
      return NextResponse.json({ status: 'ok' });
    }
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: (err as Error).message }, { status: 400 });
  }
} 