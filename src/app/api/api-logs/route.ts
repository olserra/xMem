import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@prisma/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !['OWNER', 'ADMIN'].includes(session.user.role || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || undefined;
  const action = searchParams.get('action') || undefined;
  const resource = searchParams.get('resource') || undefined;
  const from = searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined;
  const to = searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined;

  const where: any = { organizationId: session.user.organizationId };
  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (resource) where.resource = resource;
  if (from || to) where.timestamp = {};
  if (from) where.timestamp.gte = from;
  if (to) where.timestamp.lte = to;

  const logs = await prisma.auditLog.findMany({
    where,
    orderBy: { timestamp: 'desc' },
    take: 200,
  });
  return NextResponse.json(logs);
} 