import { searchDocuments } from '../../backend/services/searchService';
import { NextResponse } from 'next/server';

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
    const { query, language = 'JavaScript', framework } = body;

    if (!query) {
      return createErrorResponse('Search query is required', 400);
    }

    // Enhance query for React hooks
    const enhancedQuery = query.toLowerCase().startsWith('use') 
      ? `React ${query} hook`
      : query;

    const results = await searchDocuments(enhancedQuery, language, framework);
    
    // Check if we have any results, regardless of Elasticsearch status
    if (results.results && results.results.length > 0) {
      return createSuccessResponse({
        ...results,
        metadata: {
          ...results.metadata,
          sources: {
            ...results.metadata.sources,
            elasticsearch: false // Explicitly mark Elasticsearch as unavailable
          }
        }
      });
    }

    // Handle case where we have no results
    if (results.metadata?.error) {
      // Log the Elasticsearch error but don't expose it to the client
      console.warn('Search backend warning:', results.metadata.error);
      return createSuccessResponse({
        total: 0,
        results: [],
        metadata: {
          query: enhancedQuery,
          language,
          framework,
          sources: {
            elasticsearch: false,
            github: results.metadata.sources?.github || false,
            mdn: results.metadata.sources?.mdn || false
          }
        }
      });
    }

    // Return empty results if nothing found
    return createSuccessResponse(results);

  } catch (error: any) {
    console.error('Search error:', error);
    return createErrorResponse('An unexpected error occurred while searching');
  }
}
      
export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q');
  const language = url.searchParams.get('language') || 'JavaScript';
  const framework = url.searchParams.get('framework') || undefined;

  if (!query) {
    return createErrorResponse('Search query is required', 400);
  }

  try {
    // Enhance query for React hooks
    const enhancedQuery = query.toLowerCase().startsWith('use') 
      ? `React ${query} hook`
      : query;

    const results = await searchDocuments(enhancedQuery, language, framework);
    
    // Use the same logic as the POST handler for consistency
    if (results.results && results.results.length > 0) {
      return createSuccessResponse({
        ...results,
        metadata: {
          ...results.metadata,
          sources: {
            ...results.metadata.sources,
            elasticsearch: false
          }
        }
      });
    }

    if (results.metadata?.error) {
      console.warn('Search backend warning:', results.metadata.error);
      return createSuccessResponse({
        total: 0,
        results: [],
        metadata: {
          query: enhancedQuery,
          language,
          framework,
          sources: {
            elasticsearch: false,
            github: results.metadata.sources?.github || false,
            mdn: results.metadata.sources?.mdn || false
          }
        }
      });
    }

    return createSuccessResponse(results);
  } catch (error) {
    console.error('Search error:', error);
    return createErrorResponse('An unexpected error occurred while searching');
  }
}