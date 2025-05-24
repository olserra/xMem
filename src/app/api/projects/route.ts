import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import type { Session } from 'next-auth';

function getUserId(session: Session | null): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

async function getUserOrgId(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { organizationId: true } });
  return user?.organizationId;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  organizationId?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const organizationId = await getUserOrgId(userId);
  if (!organizationId) return NextResponse.json({ error: 'No organization found' }, { status: 403 });
  const projects: Project[] = await prisma.project.findMany({ where: { organizationId }, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const organizationId = await getUserOrgId(userId);
  if (!organizationId) return NextResponse.json({ error: 'No organization found' }, { status: 403 });
  const { name, description } = await req.json();
  const project = await prisma.project.create({ data: { name, description, userId, organizationId } });
  return NextResponse.json(project);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const organizationId = await getUserOrgId(userId);
  if (!organizationId) return NextResponse.json({ error: 'No organization found' }, { status: 403 });
  const { id, name, description } = await req.json();
  const project = await prisma.project.update({ where: { id, organizationId }, data: { name, description } });
  return NextResponse.json(project);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = getUserId(session);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const organizationId = await getUserOrgId(userId);
  if (!organizationId) return NextResponse.json({ error: 'No organization found' }, { status: 403 });
  const { id } = await req.json();
  await prisma.project.delete({ where: { id, organizationId } });
  return NextResponse.json({ success: true });
} 