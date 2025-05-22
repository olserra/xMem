import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/auth';
import { orchestrator } from '../../../backend/orchestrator';

// Helper to extract userId from session
function getUserId(session: Session | null): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

// GET: List all sessions for the user (stub, as session listing may depend on backend)
export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // If your session store supports listing, implement here. Otherwise, return not implemented.
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
  await orchestrator.getProvider('session').setSession(data.sessionId, { ...data.memory, userId });
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
  await orchestrator.getProvider('session').deleteSession(sessionId);
  return NextResponse.json({ success: true });
} 