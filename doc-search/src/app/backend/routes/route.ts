import { searchDocuments } from '../../backend/services/searchService';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { query, language, framework } = body;
      
      const results = await searchDocuments(query, language, framework);
      
      return NextResponse.json(results);
    } catch (error) {
      console.error('Search API error:', error);
      return NextResponse.json(
        { error: 'Search failed' }, 
        { status: 500 }
      );
    }
  }