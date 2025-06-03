import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import type { Session } from 'next-auth';

function getUserId(session: Session | null): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // List organizations the user belongs to
  let orgs = await prisma.organization.findMany({
    where: { users: { some: { id: userId } } },
    orderBy: { createdAt: 'desc' },
    include: { users: { where: { id: userId }, select: { role: true } } },
  });
  // If no orgs, create a default Hobby org for the user
  if (orgs.length === 0) {
    const hobbyOrg = await prisma.organization.create({
      data: {
        name: 'Hobby',
        description: 'Default free organization',
        users: { connect: { id: userId } },
      },
    });
    await prisma.user.update({ where: { id: userId }, data: { organizationId: hobbyOrg.id, role: 'OWNER' } });
    orgs = [await prisma.organization.findUnique({ where: { id: hobbyOrg.id }, include: { users: { where: { id: userId }, select: { role: true } } } })];
  }
  // Attach the current user's role to each org
  const orgsWithRole = orgs.map(org => ({
    ...org,
    role: org.users[0]?.role || null,
    users: undefined, // remove users array from response
  }));
  return NextResponse.json(orgsWithRole);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, description } = await req.json();
  // Create org and set user as OWNER
  const org = await prisma.organization.create({
    data: {
      name,
      description,
      users: { connect: { id: userId } },
    },
  });
  await prisma.user.update({ where: { id: userId }, data: { organizationId: org.id, role: 'OWNER' } });
  return NextResponse.json(org);
}

// Invite user (PUT /organizations)
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { organizationId: true, role: true } });
  if (!user?.organizationId || (user.role !== 'OWNER' && user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { email, role } = await req.json();
  // Find or create user by email, assign to org
  let invitedUser = await prisma.user.findUnique({ where: { email } });
  if (!invitedUser) {
    invitedUser = await prisma.user.create({ data: { email, organizationId: user.organizationId, role: role || 'MEMBER' } });
  } else {
    await prisma.user.update({ where: { id: invitedUser.id }, data: { organizationId: user.organizationId, role: role || 'MEMBER' } });
  }
  // TODO: send invite email (out of scope for now)
  return NextResponse.json({ success: true });
} 