import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../prisma/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';
import type { Session } from 'next-auth';
import nodemailer from 'nodemailer';

function getUserId(session: Session | null): string | null {
  return session?.user && session.user.id ? session.user.id : null;
}

async function sendInviteEmail({ to, orgName }: { to: string; orgName: string }) {
  if (!to) return;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASS,
    },
  });
  // Use the xmem PNG logo for best compatibility
  const logoUrl = `${process.env.NEXTAUTH_URL || 'https://www.xmem.xyz'}/xmem-logo.png`;
  const html = `
    <div style="background:#f9fafb;padding:0;margin:0;font-family:sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:white;border-radius:12px;box-shadow:0 2px 12px #0001;overflow:hidden;">
        <div style="background:#0f172a;padding:32px 0;text-align:center;">
          <span style="font-size:2rem;font-weight:700;letter-spacing:1px;background:linear-gradient(90deg,#06b6d4,#6366f1,#a21caf);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:transparent;">xMem</span>
          <div style="font-family:sans-serif;color:#94a3b8;font-size:1rem;font-weight:400;margin-top:4px;">xmem.xyz</div>
        </div>
        <div style="padding:32px 24px 24px 24px;text-align:center;">
          <h2 style="color:#0f172a;font-size:1.5rem;margin-bottom:12px;">You have been invited to join <span style='color:#06b6d4;'>${orgName}</span> on xmem!</h2>
          <p style="color:#334155;font-size:1rem;margin-bottom:24px;">Welcome to the team. Click below to get started and access your organization dashboard.</p>
          <a href="${process.env.NEXTAUTH_URL || 'https://www.xmem.xyz'}/login" style="display:inline-block;padding:12px 32px;background:linear-gradient(90deg,#06b6d4,#6366f1);color:white;font-weight:600;border-radius:8px;text-decoration:none;font-size:1rem;">Accept Invite &rarr;</a>
        </div>
        <div style="padding:16px 0;text-align:center;color:#64748b;font-size:0.9rem;background:#f1f5f9;">&copy; ${new Date().getFullYear()} xmem. All rights reserved.</div>
      </div>
    </div>
  `;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `You're invited to join ${orgName} on xmem!`,
    html,
  });
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
  // Send invite email if email exists
  if (email) {
    const org = await prisma.organization.findUnique({ where: { id: user.organizationId } });
    await sendInviteEmail({ to: email, orgName: org?.name || 'your organization' });
  }
  return NextResponse.json({ success: true });
} 