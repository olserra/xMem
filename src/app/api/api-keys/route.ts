import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@prisma/prisma';
import { randomBytes } from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import type { Session } from 'next-auth';
import { logAudit } from '../auth/auditLog';

// Helper to extract userId from session
function getUserId(session: Session | null): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const keys = await prisma.aPIKey.findMany({
    where: { userId, revokedAt: null },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(keys);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { name } = await req.json();
  const key = randomBytes(32).toString('hex');
  const apiKey = await prisma.aPIKey.create({
    data: { name, key, userId },
  });
  await logAudit({
    userId,
    organizationId: session?.user?.organizationId,
    action: 'CREATE',
    resource: 'api-key',
    resourceId: apiKey.id,
    details: { name },
    req,
  });
  return NextResponse.json({ ...apiKey, key });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  await prisma.aPIKey.updateMany({
    where: { id, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  await logAudit({
    userId,
    organizationId: session?.user?.organizationId,
    action: 'DELETE',
    resource: 'api-key',
    resourceId: id,
    req,
  });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await req.json();
  await prisma.aPIKey.updateMany({
    where: { id, userId, revokedAt: null },
    data: { lastUsed: new Date() },
  });
  await logAudit({
    userId,
    organizationId: session?.user?.organizationId,
    action: 'USE',
    resource: 'api-key',
    resourceId: id,
    req,
  });
  return NextResponse.json({ success: true });
} 