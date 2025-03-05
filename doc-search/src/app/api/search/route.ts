import { searchDocuments } from '../../backend/services/searchService';
import { NextResponse } from 'next/server';


const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

// Common error response helper
function createErrorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

// Common success response helper
function createSuccessResponse(data: any) {
  return NextResponse.json({
    success: true,
    data
  });
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.query) {
      return createErrorResponse('Search query is required', 400);
    }

    // Forward the request to Express server
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return createErrorResponse(data.error || 'Search failed', response.status);
    }

    return createSuccessResponse(data.data);

  } catch (error) {
    console.error('Search API error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error'
    );
  }
}
      

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const query = searchParams.get('q');
    if (!query) {
      return createErrorResponse('Search query is required', 400);
    }

    // Forward the request to Express server
    const response = await fetch(`${API_BASE_URL}/api/search?${searchParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      return createErrorResponse(data.error || 'Search failed', response.status);
    }

    return createSuccessResponse(data.data);

  } catch (error) {
    console.error('Search API error:', error);
    return createErrorResponse(
      error instanceof Error ? error.message : 'Internal server error'
    );
  }
}