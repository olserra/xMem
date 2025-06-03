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

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !['OWNER', 'ADMIN'].includes(session.user.role || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const orgId = session.user.organizationId;
  if (!orgId) {
    return NextResponse.json({ error: 'No organization found' }, { status: 400 });
  }
  const { userId } = await req.json();
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }
  // Prevent removing OWNER
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.organizationId !== orgId) {
    return NextResponse.json({ error: 'User not in organization' }, { status: 404 });
  }
  if (user.role === 'OWNER') {
    return NextResponse.json({ error: 'Cannot remove owner' }, { status: 403 });
  }
  await prisma.user.update({ where: { id: userId }, data: { organizationId: null, role: null } });
  return NextResponse.json({ success: true });
} 