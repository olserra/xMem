import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';

interface ProgressData {
    skillId: string;
    currentProgress: number;
    userId: string;
}

// Helper function to set CORS headers
function setCorsHeaders(response: { headers: { set: (arg0: string, arg1: string) => void; }; }) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

// Handle GET requests
export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
  
    try {
      let responseData;
      if (userId) {
        const progressEntries = await prisma.progress.findMany({
          where: { userId },
          include: { skill: true },
        });
        responseData = NextResponse.json(progressEntries);
      } else {
        const skills = await prisma.skill.findMany();
        responseData = NextResponse.json(skills);
      }
      return setCorsHeaders(responseData);
    } catch (error) {
      console.error('Error fetching skills or progress:', error);
      const errorResponse = NextResponse.json(
        { error: 'Failed to fetch skills or progress' },
        { status: 500 }
      );
      return setCorsHeaders(errorResponse);
    }
  };

// Handle POST requests for user progress
export const POST = async (req: Request) => {
    const { skillId, currentProgress, userId } = await req.json();
  
    if (!skillId || typeof currentProgress !== 'number' || !userId) {
      const errorResponse = new Response(
        JSON.stringify({ error: 'skillId, currentProgress, and userId are required' }),
        { status: 400 }
      );
      return setCorsHeaders(errorResponse);
    }
  
    try {
      // Check if the skill exists
      const skill = await prisma.skill.findUnique({
        where: { id: skillId },
      });
  
      if (!skill) {
        const errorResponse = new Response(JSON.stringify({ error: 'Skill not found' }), {
          status: 404,
        });
        return setCorsHeaders(errorResponse);
      }
  
      // Create the progress entry
      const newProgress = await prisma.progress.create({
        data: {
          skillId,
          currentProgress,
          userId,
        },
      });
      const successResponse = new Response(JSON.stringify(newProgress), { status: 201 });
      return setCorsHeaders(successResponse);
    } catch (error) {
      console.error('Error creating progress:', error);
      const errorResponse = new Response(JSON.stringify({ error: 'Failed to create progress' }), {
        status: 500,
      });
      return setCorsHeaders(errorResponse);
    }
  };
  

// Handle PUT requests for updating progress
export const PUT = async (req: Request) => {
    const { id, currentProgress } = await req.json();
  
    if (!id || typeof currentProgress !== 'number') {
      const errorResponse = new Response(
        JSON.stringify({ error: 'ID and currentProgress are required' }),
        { status: 400 }
      );
      return setCorsHeaders(errorResponse);
    }
  
    try {
      const updatedEntry = await prisma.progress.update({
        where: { id },
        data: { currentProgress },
      });
      const successResponse = new Response(JSON.stringify(updatedEntry), { status: 200 });
      return setCorsHeaders(successResponse);
    } catch (error) {
      console.error('Error updating progress:', error);
      const errorResponse = new Response(JSON.stringify({ error: 'Failed to update progress' }), {
        status: 500,
      });
      return setCorsHeaders(errorResponse);
    }
  };
  

// Handle DELETE requests
export const DELETE = async (req: Request) => {
    const { progressId } = await req.json();
  
    if (!progressId) {
      const errorResponse = new Response(JSON.stringify({ error: 'Progress ID is required' }), {
        status: 400,
      });
      return setCorsHeaders(errorResponse);
    }
  
    try {
      await prisma.progress.delete({
        where: { id: progressId },
      });
      const successResponse = new Response(null, { status: 204 }); // No content to send back
      return setCorsHeaders(successResponse);
    } catch (error) {
      console.error('Error deleting progress:', error);
      const errorResponse = new Response(JSON.stringify({ error: 'Failed to delete progress' }), {
        status: 500,
      });
      return setCorsHeaders(errorResponse);
    }
  };
  