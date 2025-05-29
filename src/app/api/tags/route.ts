import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const mlApiUrl = process.env.ML_API_URL;
  if (!mlApiUrl) {
    console.error('ML_API_URL is not set');
    return NextResponse.json({ error: 'ML_API_URL is not set' }, { status: 500 });
  }

  try {
    const body = await req.text();
    const mlRes = await fetch(`${mlApiUrl.replace(/\/$/, '')}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
      },
      body,
    });

    const contentType = mlRes.headers.get('content-type') || '';
    const mlResBody = await mlRes.text();
    if (!mlRes.ok) {
      console.error('ML API /tags error:', mlRes.status, mlResBody);
      return NextResponse.json({ error: 'ML API /tags error', status: mlRes.status, body: mlResBody }, { status: 500 });
    }
    return new NextResponse(mlResBody, {
      status: mlRes.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (err) {
    console.error('Failed to proxy to ML API:', err);
    return NextResponse.json({ error: 'Failed to proxy to ML API', details: (err as Error).message }, { status: 500 });
  }
} 