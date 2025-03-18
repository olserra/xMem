import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  console.log('Bearer Token GET: Request received');
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  console.log('Bearer Token GET: Session and params:', {
    sessionUserId: session?.user?.id,
    requestedUserId: userId
  });

  // Ensure we have a valid session and the userId matches
  if (!session?.user?.id || (userId && session.user.id !== userId)) {
    console.log('Bearer Token GET: Unauthorized - session/userId mismatch');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Bearer Token GET: Looking for existing API key');
    const apiKey = await prisma.apiKey.findFirst({
      where: { userId: session.user.id },
      select: { key: true },
    });

    if (!apiKey) {
      console.log('Bearer Token GET: No existing key found, creating new one');
      // If no API key exists, create one
      const newKey = await prisma.apiKey.create({
        data: {
          userId: session.user.id,
          key: crypto.randomUUID(),
        },
        select: { key: true },
      });
      console.log('Bearer Token GET: New key created successfully');
      return NextResponse.json({ key: newKey.key }, { status: 200 });
    }

    console.log('Bearer Token GET: Existing key found');
    return NextResponse.json({ key: apiKey.key }, { status: 200 });
  } catch (error) {
    console.error('Bearer Token GET: Failed to retrieve API key:', error);
    return NextResponse.json({ error: 'Failed to retrieve API key' }, { status: 500 });
  }
}


// Handle POST request (to create API key)
export async function POST(req: Request) {
  console.log('Bearer Token POST: Request received');
  const session = await getServerSession(authOptions);
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');
  console.log('Bearer Token POST: Session and params:', {
    sessionUserId: session?.user?.id,
    requestedUserId: userId
  });

  // Ensure we have a valid session and the userId matches
  if (!session?.user?.id || (userId && session.user.id !== userId)) {
    console.log('Bearer Token POST: Unauthorized - session/userId mismatch');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('Bearer Token POST: Generating new API key');
    // Generate a new API key
    const key = crypto.randomUUID();

    // Create a new API key for the user
    const apiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        key: key,
      },
    });

    console.log('Bearer Token POST: New key created successfully');
    return NextResponse.json({ key: apiKey.key }, { status: 201 });
  } catch (error) {
    console.error('Bearer Token POST: Error creating API key:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

