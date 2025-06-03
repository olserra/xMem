import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';

// Helper to extract userId from session
function getUserId(session: Session | null): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');

  if (projectId) {
    // Fetch sources linked to the project (many-to-many) and global/user-level sources
    const projectSources = await prisma.projectMemorySource.findMany({
      where: { projectId },
      include: { memorySource: true },
    });
    // Also fetch user-level sources not linked to any project
    const globalSources = await prisma.memorySource.findMany({
      where: { userId, projectId: null },
      orderBy: { createdAt: 'desc' },
    });
    // Flatten and merge
    const sources = [
      ...projectSources.map(ps => ps.memorySource),
      ...globalSources.filter(gs => !projectSources.some(ps => ps.memorySource.id === gs.id)),
    ];
    return NextResponse.json(sources);
  } else {
    // No projectId: return all sources owned by the user
    const sources = await prisma.memorySource.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(sources);
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  if (!data.type) data.type = 'qdrant';
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
      } else if (data.type === 'pinecone') {
        // Pinecone connection check
        const baseUrl = data.url || data.vectorDbUrl;
        const apiKey = data.apiKey;
        if (!baseUrl || !apiKey) {
          return NextResponse.json({ status: 'disconnected', error: 'Missing Pinecone URL or API key.' }, { status: 400 });
        }
        // Pinecone REST API expects: https://{index}-{env}.svc.{env}.pinecone.io
        // /describe_index_stats endpoint
        const url = `${baseUrl.replace(/\/$/, '')}/describe_index_stats`;
        const headers = {
          'Content-Type': 'application/json',
          'Api-Key': apiKey,
        };
        const res = await fetch(url, { method: 'POST', headers });
        const text = await res.text();
        if (res.ok) {
          return NextResponse.json({ status: 'connected', debug: { url, headers, status: res.status, statusText: res.statusText, body: text } });
        } else {
          return NextResponse.json({ status: 'disconnected', error: 'Could not connect to Pinecone.', debug: { url, headers, status: res.status, statusText: res.statusText, body: text } }, { status: 400 });
        }
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
  const source = await prisma.memorySource.create({
    data: {
      type: data.type,
      status: data.status || 'disconnected',
      itemCount: data.itemCount ?? null,
      lastSync: data.lastSync ? new Date(data.lastSync) : null,
      vectorDbUrl: data.vectorDbUrl || data.url,
      apiKey: data.apiKey,
      embeddingModel: data.embeddingModel,
      llmProvider: data.llmProvider,
      maxCacheSize: data.maxCacheSize,
      sessionTtl: data.sessionTtl,
      enableCache: data.enableCache,
      collection: data.collection,
      metric: data.metric,
      dimensions: data.dimensions,
      user: { connect: { id: userId } },
      ...(data.projectId ? { project: { connect: { id: data.projectId } } } : {}),
    },
  });
  return NextResponse.json({ success: true, id: source.id });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  if (!data.type) data.type = 'qdrant';
  const source = await prisma.memorySource.update({
    where: { id: data.id, userId },
    data: {
      type: data.type,
      status: data.status,
      itemCount: data.itemCount,
      lastSync: data.lastSync ? new Date(data.lastSync) : null,
      vectorDbUrl: data.vectorDbUrl || data.url,
      apiKey: data.apiKey,
      embeddingModel: data.embeddingModel,
      llmProvider: data.llmProvider,
      maxCacheSize: data.maxCacheSize,
      sessionTtl: data.sessionTtl,
      enableCache: data.enableCache,
      collection: data.collection,
      metric: data.metric,
      dimensions: data.dimensions,
    },
  });
  return NextResponse.json({ success: true, id: source.id });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  // Check ownership first
  const source = await prisma.memorySource.findUnique({ where: { id } });
  if (!source || source.userId !== userId) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
  }
  await prisma.memorySource.delete({ where: { id } });
  return NextResponse.json({ success: true });
} 