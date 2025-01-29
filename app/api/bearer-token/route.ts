import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    console.error('User ID is missing');
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const apiKey = await prisma.apiKey.findFirst({
      where: { userId: userId }, // Query by userId
      select: { key: true }, // Select the key field
    });

    if (!apiKey) {
      console.error('API key not found for the user');
      return NextResponse.json({ error: 'API key not found for the user' }, { status: 404 });
    }

    return NextResponse.json({ key: apiKey.key }, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve API key:', error);
    return NextResponse.json({ error: 'Failed to retrieve API key' }, { status: 500 });
  }
}


// Handle POST request (to create API key)
export async function POST(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }

  const { name, description } = await req.json();

  if (!name || !description) {
    return NextResponse.json({
      error: 'Project name and description are required'
    }, { status: 400 });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        userId: userId, // Use userId from the validated token
        visibility: 'private',
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

