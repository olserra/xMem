import { NextRequest, NextResponse } from 'next/server';
import { logAudit } from '../auth/auditLog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/auth';

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    if (action === 'delete') {
      // TODO: Connect to vector DB delete logic
      const session = await getServerSession(authOptions);
      await logAudit({
        userId: session?.user?.id,
        organizationId: session?.user?.organizationId,
        action: 'DELETE',
        resource: 'memory',
        resourceId: data?.id,
        details: data,
        req,
      });
      console.log('Delete memory:', data);
      return NextResponse.json({ status: 'ok' });
    }
    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: (err as Error).message }, { status: 400 });
  }
} 