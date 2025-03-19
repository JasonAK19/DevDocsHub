import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body first
    const body = await request.json();
    console.log("Received POST request body:", body);
    
    // Get user ID from multiple sources
    const { userId: bodyUserId, title, code, language, description, tags } = body;
    
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;
    
    // Use userId from body if session is not available
    const userId = sessionUserId || bodyUserId;
    
    console.log("Authentication info:", { 
      sessionUserId, 
      bodyUserId, 
      finalUserId: userId 
    });
    
    if (!userId) {
      return NextResponse.json({
        error: 'You must be logged in to create a snippet'
      }, {
        status: 401
      });
    }
    
    // Validate required fields
    if (!title || !code || !language) {
      return NextResponse.json({
        error: 'Title, code, and language are required'
      }, {
        status: 400
      });
    }
    
    // Create the snippet
    const newSnippet = await prisma.codeSnippet.create({
      data: {
        title,
        code,
        language,
        description,
        tags,
        userId
      }
    });
    
    return NextResponse.json(newSnippet, {
      status: 201
    });
  } catch (error) {
    console.error('Error creating snippet:', error);
    
    return NextResponse.json({
      error: 'Failed to create snippet'
    }, {
      status: 500
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get userId from query parameter as a fallback if session fails
    const { searchParams } = new URL(request.url);
    const queryUserId = searchParams.get('userId');
    
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id;
    
    // Use userId from query if session is not available
    const userId = sessionUserId || queryUserId;
    
    if (!userId) {
      return NextResponse.json({
        error: 'You must be logged in to view snippets'
      }, {
        status: 401
      });
    }
    
    // Get the user's snippets
    const snippets = await prisma.codeSnippet.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(snippets);
  } catch (error) {
    console.error('Error fetching snippets:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch snippets'
    }, {
      status: 500
    });
  }
}
