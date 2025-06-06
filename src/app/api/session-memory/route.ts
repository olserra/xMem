import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import { prisma } from '../../../../prisma/prisma';

// Helper to extract userId from session
function getUserId(session: any): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

// GET: List all messages for a session, or all sessions for the user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  if (sessionId) {
    // List all messages for this session
    const messages = await prisma.sessionMessage.findMany({
      where: { userId, sessionId, deleted: false },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ sessionId, messages });
  }
  // List all sessions for the user
  const sessions = await prisma.sessionMemory.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: { sessionId: true, updatedAt: true },
  });
  return NextResponse.json({ sessions });
}

// POST: Add a new session memory or message(s)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { sessionId, content, role, embedding, pin, messageExampleContent } = body;
  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
  }
  if (!content || !role) {
    return NextResponse.json({ error: 'Missing content or role' }, { status: 400 });
  }
  // Ensure session exists
  await prisma.sessionMemory.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId, userId },
  });
  // Add the user message
  const message = await prisma.sessionMessage.create({
    data: {
      sessionId,
      userId,
      role,
      content,
      embedding: embedding || [],
      pinned: !!pin,
    },
  });
  // Also add the messageExample if not already present in this session
  if (messageExampleContent) {
    const existingExample = await prisma.sessionMessage.findFirst({
      where: { sessionId, role: 'system', content: messageExampleContent },
    });
    if (!existingExample) {
      await prisma.sessionMessage.create({
        data: {
          sessionId,
          userId,
          role: 'system',
          content: messageExampleContent,
          embedding: [],
          pinned: false,
          deleted: false,
        },
      });
    }
  }
  return NextResponse.json(message, { status: 201 });
}

// DELETE: Soft delete a message or delete a session
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { messageId, sessionId } = await req.json();
  if (messageId) {
    // Soft delete message
    await prisma.sessionMessage.update({ where: { id: messageId }, data: { deleted: true } });
    return NextResponse.json({ success: true });
  }
  if (sessionId) {
    // Delete all messages and session
    await prisma.sessionMessage.updateMany({ where: { sessionId }, data: { deleted: true } });
    await prisma.sessionMemory.delete({ where: { sessionId } });
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: 'Missing messageId or sessionId' }, { status: 400 });
} 