export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get the 'details' query parameter
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('details') === 'true';
    
    try {
      // Use completely separate query structures based on the condition
      let bookmarks;
      
      if (includeDetails) {
        bookmarks = await prisma.bookmark.findMany({
          where: {
            userId: userId
          },
          include: { 
            page: { 
              select: { 
                id: true, 
                url: true, 
                title: true 
              } 
            } 
          }
        });
      } else {
        bookmarks = await prisma.bookmark.findMany({
          where: {
            userId: userId
          },
          select: { 
            id: true, 
            userId: true, 
            pageId: true, 
            createdAt: true 
          }
        });
      }
      
      return NextResponse.json({ bookmarks });
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 });
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { pageId } = await request.json();
    
    if (!pageId) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }
    
    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        pageId: pageId
      }
    });
    
    if (existingBookmark) {
      return NextResponse.json({ error: 'Bookmark already exists' }, { status: 400 });
    }
    
    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId: userId,
        pageId: pageId
      }
    });
    
    return NextResponse.json({ bookmark });
  } catch (error) {
    console.error('Failed to create bookmark:', error);
    return NextResponse.json({ error: 'Failed to create bookmark' }, { status: 500 });
  }
}