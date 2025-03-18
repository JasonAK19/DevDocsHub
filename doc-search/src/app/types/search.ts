export const dynamic = 'force-dynamic';
/*
export interface SearchResult {
    title: string;
    url: string;
    description: string;
    source: string;
    language?: string;
    lastUpdated: string;
  }

*/
export interface SearchParams {
  q?: string;
  language?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  metadata?: {
    total?: number;
    took?: number;
  };
}

export interface SearchResult {
  title: string;
  summary?: string;
  content?: string;
  url: string;
  source: string;
}

export interface FormattedSearchResult {
  title: string;
  description: string;
  url: string;
  source: string;
  language: string;
  lastUpdated: string;
}

