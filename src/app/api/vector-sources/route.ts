import { NextRequest, NextResponse } from 'next/server';

// Define the VectorSource type based on the example and usage
interface VectorSource {
  id: string;
  name: string;
  type: string;
  url: string;
  apiKey: string;
  collection: string;
  status: 'connected' | 'disconnected';
  lastSync: string | null;
}

// In-memory store for demo; replace with DB in production
let vectorSources: VectorSource[] = [
  // Example source
  // {
  //   id: '1',
  //   name: 'Qdrant Cloud',
  //   type: 'qdrant',
  //   url: 'https://example.qdrant.io:6333',
  //   apiKey: '***',
  //   collection: 'xmem_collection',
  //   status: 'connected',
  //   lastSync: new Date().toISOString(),
  // }
];

export async function GET() {
  return NextResponse.json(vectorSources);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (data.checkConnection) {
    try {
      if (data.type === 'qdrant') {
        // Qdrant connection check: try /collections, then /, then /collections/{collection}
        const baseUrl = data.url.replace(/\/$/, '');
        const headers = {
          'Content-Type': 'application/json',
          ...(data.apiKey ? { 'api-key': data.apiKey } : {})
        };
        const endpoints = [`${baseUrl}/collections`, `${baseUrl}/`];
        if (data.collection) {
          endpoints.push(`${baseUrl}/collections/${data.collection}`);
        }
        const allDebug = [];
        for (const url of endpoints) {
          console.log('Qdrant check:', { url, headers });
          const res = await fetch(url, { headers });
          const text = await res.text();
          console.log('Qdrant response:', { status: res.status, body: text });
          allDebug.push({ url, headers, status: res.status, statusText: res.statusText, body: text });
          if (res.ok) {
            return NextResponse.json({ status: 'connected', debug: { url, headers, status: res.status, statusText: res.statusText, body: text } });
          }
        }
        return NextResponse.json({ status: 'disconnected', error: 'Could not connect to the vector DB.', debug: allDebug }, { status: 400 });
      } else {
        // Default to ChromaDB connection check
        const url = `${data.url.replace(/\/$/, '')}/api/v1/collections`;
        const headers = {
          'Content-Type': 'application/json',
          ...(data.apiKey ? { 'Authorization': `Bearer ${data.apiKey}` } : {})
        };
        const res = await fetch(url, { headers });
        const text = await res.text();
        const debug = { url, headers, status: res.status, statusText: res.statusText, body: text };
        if (res.ok) {
          return NextResponse.json({ status: 'connected', debug });
        } else {
          return NextResponse.json({ status: 'disconnected', error: 'Could not connect to the vector DB.', debug }, { status: 400 });
        }
      }
    } catch (e) {
      return NextResponse.json({ status: 'disconnected', error: (e as Error).message }, { status: 400 });
    }
  }
  const id = Date.now().toString();
  vectorSources.push({ ...data, id, status: 'disconnected', lastSync: null });
  return NextResponse.json({ success: true, id });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const idx = vectorSources.findIndex(s => s.id === data.id);
  if (idx !== -1) {
    vectorSources[idx] = { ...vectorSources[idx], ...data };
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  vectorSources = vectorSources.filter(s => s.id !== id);
  return NextResponse.json({ success: true });
} 