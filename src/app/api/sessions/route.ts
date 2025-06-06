import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { prisma } from '../../../../prisma/prisma';
import { orchestrator } from '@/backend/orchestrator';

// Helper to extract userId from session
function getUserId(session: Session | null): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

// GET: Fetch a session by sessionId query param or list all sessions
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (sessionId) {
    const sessionMemory = await prisma.sessionMemory.findUnique({ where: { sessionId } });
    if (!sessionMemory) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    const messages = await prisma.sessionMessage.findMany({
      where: { sessionId, deleted: false },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({
      sessionId,
      summary: sessionMemory.summary,
      updatedAt: sessionMemory.updatedAt,
      messages,
    });
  }
  // List all sessions for the user
  const sessions = await prisma.sessionMemory.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { sessionId: true, summary: true, updatedAt: true },
  });
  return NextResponse.json({ sessions });
}

// POST: Create or update a session memory
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await req.json();
  if (!data.sessionId || !data.memory) {
    return NextResponse.json({ error: 'Missing sessionId or memory' }, { status: 400 });
  }
  // Attach userId to memory for scoping if needed
  const sessionProvider = orchestrator.getProvider<import('../../../backend/xmem').SessionStore>('session');
  await sessionProvider.setSession(data.sessionId, { ...data.memory, userId });
  return NextResponse.json({ success: true });
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
  // Delete all messages and session
  await prisma.sessionMessage.deleteMany({ where: { sessionId } });
  await prisma.sessionMemory.delete({ where: { sessionId } });
  return NextResponse.json({ success: true });
}