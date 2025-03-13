import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includePages = searchParams.get('includePages') === 'true';
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    try {
      // Fix the Prisma query
      const bookmarks = await prisma.bookmark.findMany({
        where: {
          userId: userId
        },
      
        ...(includePages ? {
          include: {
            page: {
              select: {
                id: true,
                url: true,
                title: true
              }
            }
          }
        } : {
          select: {
            id: true,
            userId: true,
            pageId: true,
            createdAt: true
          }
        })
      });
      
      return NextResponse.json(bookmarks);
    } catch (error) {
      console.error('Failed to fetch bookmarks:', error);
      
      // Fix error handling
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return NextResponse.json({ 
        error: 'Failed to fetch bookmarks', 
        details: errorMessage
      }, { status: 500 });
    }
  }

export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { userId, pageId, title, url } = body;
      
      console.log('Creating bookmark:', { userId, pageId });
      
      if (!userId || !pageId) {
        return NextResponse.json({ error: 'User ID and Page ID are required' }, { status: 400 });
      }
      
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      let page = null;
      
      if (url) {
        page = await prisma.docPage.findFirst({
          where: { url: url }
        });
      }
      
      // If page doesn't exist, create it
      if (!page) {
        let source = await prisma.documentationSource.findFirst({
          where: { name: 'External' }
        });
        
        if (!source) {
          source = await prisma.documentationSource.create({
            data: {
              name: 'External',
              baseUrl: '',
              type: 'OTHER'
            }
          });
        }
        
        // Create the page
        page = await prisma.docPage.create({
          data: {
            url: url || '',
            title: title || 'Untitled',
            content: '', // Empty content for now
            sourceId: source.id,
          }
        });
      }
      
      // Check if bookmark already exists
      const existingBookmark = await prisma.bookmark.findFirst({
        where: {
          userId: userId,
          pageId: page.id 
        }
      });
      
      if (existingBookmark) {
        return NextResponse.json({ 
          message: 'Bookmark already exists',
          bookmark: existingBookmark 
        }, { status: 200 });
      }
      
      const bookmark = await prisma.bookmark.create({
        data: {
          userId: userId,
          pageId: page.id // Use the page ID from our database
        }
      });
      
      return NextResponse.json({ 
        message: 'Bookmark created successfully',
        bookmark: bookmark 
      });
    } catch (error) {
      console.error('Failed to create bookmark:', error);
      
      // Fix the error handling
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return NextResponse.json({ 
        error: 'Failed to create bookmark', 
        details: errorMessage 
      }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;
  
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const bookmarkId = params.id;
      if (!bookmarkId) {
        return NextResponse.json({ error: 'Bookmark ID is required' }, { status: 400 });
      }
  
      // Check if bookmark exists and belongs to the user
      const bookmark = await prisma.bookmark.findUnique({
        where: { id: bookmarkId }
      });
  
      if (!bookmark) {
        return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
      }
  
      if (bookmark.userId !== userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
       // Delete the bookmark
    await prisma.bookmark.delete({
        where: { id: bookmarkId }
      });
  
      return NextResponse.json({ 
        message: 'Bookmark deleted successfully' 
      });
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      return NextResponse.json({ 
        error: 'Failed to delete bookmark', 
        details: errorMessage 
      }, { status: 500 });
    }
  }
  

