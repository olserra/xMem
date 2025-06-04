import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { orchestrator } from '../../../backend/orchestrator';

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
  const sessionProvider = orchestrator.getProvider<import('../../../backend/xmem').SessionStore>('session');
  if (sessionId) {
    const sessionObj = await sessionProvider.getSession(sessionId);
    if (!sessionObj) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    // Only return memory fields, not userId
    const { userId: _userId, ...memoryData } = sessionObj;
    return NextResponse.json({ memory: memoryData });
  }
  // List all sessions for the user
  if (typeof (sessionProvider as any).listSessions === 'function') {
    const sessions = await (sessionProvider as any).listSessions();
    // Only return sessions for this user (if userId is present in memory)
    const filtered = sessions.filter((s: any) => !s.memory.userId || s.memory.userId === userId);
    // Return summary (id, createdAt, updatedAt, memory summary)
    return NextResponse.json({
      sessions: filtered.map((s: any) => ({
        sessionId: s.sessionId,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
        memory: s.memory,
      }))
    });
  }
  return NextResponse.json({ error: 'Session listing not implemented' }, { status: 501 });
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
  // Optionally, check if session belongs to user
  const sessionProvider = orchestrator.getProvider<import('../../../backend/xmem').SessionStore>('session');
  await sessionProvider.deleteSession(sessionId);
  return NextResponse.json({ success: true });
}