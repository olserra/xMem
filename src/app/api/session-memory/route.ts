import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import { prisma } from '../../../../prisma/prisma';

// Helper to extract userId from session
function getUserId(session: any): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

// GET: List all session memories for the user or get by sessionId
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (sessionId) {
    const memory = await prisma.sessionMemory.findUnique({
      where: { userId_sessionId: { userId, sessionId } },
    });
    if (!memory) {
      return NextResponse.json({ error: 'Session memory not found' }, { status: 404 });
    }
    return NextResponse.json(memory);
  }
  // List all session memories for the user
  const memories = await prisma.sessionMemory.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(memories);
}

// POST: Create a new session memory
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { sessionId, memory } = await req.json();
  if (!sessionId || memory === undefined) {
    return NextResponse.json({ error: 'Missing sessionId or memory' }, { status: 400 });
  }
  try {
    const created = await prisma.sessionMemory.create({
      data: { userId, sessionId, memory },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Session memory already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create session memory', details: err.message }, { status: 500 });
  }
}

// PUT: Update an existing session memory
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { sessionId, memory } = await req.json();
  if (!sessionId || memory === undefined) {
    return NextResponse.json({ error: 'Missing sessionId or memory' }, { status: 400 });
  }
  try {
    const updated = await prisma.sessionMemory.update({
      where: { userId_sessionId: { userId, sessionId } },
      data: { memory },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to update session memory', details: err.message }, { status: 500 });
  }
}

// DELETE: Delete a session memory
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { sessionId } = await req.json();
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }
  try {
    await prisma.sessionMemory.delete({
      where: { userId_sessionId: { userId, sessionId } },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to delete session memory', details: err.message }, { status: 500 });
  }
} 