import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    try {
        if (userId) {
            // Fetch user's progress entries
            const progressEntries = await prisma.progress.findMany({
                where: { userId },
                include: { skill: true },
            });
            return NextResponse.json(progressEntries, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        } else {
            // Fetch all available skills
            const skills = await prisma.skill.findMany();
            return NextResponse.json(skills, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }
    } catch (error) {
        console.error('Error fetching skills or progress:', error);
        return NextResponse.json(
            { error: 'Failed to fetch skills or progress' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
};

// Handle POST requests for user progress
export const POST = async (req: Request) => {
    const { skillId, currentProgress, userId } = await req.json();

    try {
      // Check if the progress entry already exists
      const existingProgress = await prisma.progress.findUnique({
        where: {
          userId_skillId: {
            userId: userId,
            skillId: skillId,
          },
        },
      });
  
      if (existingProgress) {
        // If it exists, update the progress
        const updatedProgress = await prisma.progress.update({
          where: {
            userId_skillId: {
              userId: userId,
              skillId: skillId,
            },
          },
          data: {
            currentProgress: currentProgress,
          },
        });
        return NextResponse.json(updatedProgress);
      } else {
        // Create a new entry
        const newProgress = await prisma.progress.create({
          data: {
            skillId: skillId,
            userId: userId,
            currentProgress: currentProgress,
          },
        });
        return NextResponse.json(newProgress);
      }
    } catch (error) {
      console.error('Error creating or updating progress:', error);
      return NextResponse.json({ error: 'Failed to create or update progress' }, { status: 500 });
    }
  }

// Handle PUT requests for updating progress
export const PUT = async (req: Request) => {
    const { skillId, currentProgress, userId } = await req.json();

    try {
      // Check if the progress entry already exists
      const existingProgress = await prisma.progress.findUnique({
        where: {
          userId_skillId: {
            userId: userId,
            skillId: skillId,
          },
        },
      });
  
      if (existingProgress) {
        // If it exists, update the progress
        const updatedProgress = await prisma.progress.update({
          where: {
            userId_skillId: {
              userId: userId,
              skillId: skillId,
            },
          },
          data: {
            currentProgress: currentProgress,
          },
        });
        return NextResponse.json(updatedProgress);
      } else {
        // Create a new entry
        const newProgress = await prisma.progress.create({
          data: {
            skillId: skillId,
            userId: userId,
            currentProgress: currentProgress,
          },
        });
        return NextResponse.json(newProgress);
      }
    } catch (error) {
      console.error('Error creating or updating progress:', error);
      return NextResponse.json({ error: 'Failed to create or update progress' }, { status: 500 });
    }
  }

// Handle DELETE requests
export const DELETE = async (req: Request) => {
    const { progressId } = await req.json();

    if (!progressId) {
        return NextResponse.json(
            { error: 'Progress ID is required' },
            {
                status: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }

    try {
        await prisma.progress.delete({
            where: { id: progressId },
        });
        // Change this to return just the status code, without a JSON body
        return NextResponse.json(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (error) {
        console.error('Error deleting progress:', error);
        return NextResponse.json(
            { error: 'Failed to delete progress' },
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            }
        );
    }
};
