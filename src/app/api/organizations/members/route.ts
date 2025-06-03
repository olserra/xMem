import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !['OWNER', 'ADMIN'].includes(session.user.role || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json([], { status: 200 });
  }
  const users = await prisma.user.findMany({
    where: { organizationId: orgId },
    select: { id: true, email: true, role: true },
    orderBy: { email: 'asc' },
  });
  return NextResponse.json(users);
} 