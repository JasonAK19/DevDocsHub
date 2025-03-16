export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    await prisma.bookmark.delete({
      where: {
        id: id
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete bookmark:', error);
    return NextResponse.json({ error: 'Failed to delete bookmark' }, { status: 500 });
  }
}