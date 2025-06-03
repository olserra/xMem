import { prisma } from '../../../../prisma/prisma';
import { NextRequest } from 'next/server';

export async function logAudit({
  userId,
  organizationId,
  action,
  resource,
  resourceId,
  details,
  req,
}: {
  userId?: string;
  organizationId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  req?: NextRequest;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        organizationId,
        action,
        resource,
        resourceId,
        details,
        ipAddress: req?.headers.get('x-forwarded-for') ?? null,
        userAgent: req?.headers.get('user-agent') ?? null,
      },
    });
  } catch (err) {
    // Optionally log error, but do not throw to avoid breaking main flow
    console.error('Failed to write audit log:', err);
  }
} 