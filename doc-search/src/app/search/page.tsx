import SearchResults from "@/app/components/SearchResults";
import SearchSkeleton from "../components/loading/SearchSkeleton";
import ServerError from "../components/ServerError";
import { Suspense } from "react";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { performSearch, refreshSearch } from "../actions/searchActions";
import { SearchParams, SearchResponse, SearchResult, FormattedSearchResult } from "../types/search";

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  try {
    // Wait for searchParams to be ready
    const params = await Promise.resolve(searchParams);
    const query = params?.q?.toString() || '';
    const language = params?.language?.toString() || 'JavaScript';

    // Check for query parameter
    if (!query.trim()) {
      return (
        <div className="p-4 text-gray-600">
          <h2 className="text-xl font-semibold mb-2">No Search Query</h2>
          <p>Please enter a search query to get started</p>
        </div>
      );
    }

    // Perform search
    const searchResponse = await performSearch(query, language);

    // Validate response structure
    if (!searchResponse) {
      throw new Error('No response received from search API');
    }

    // Extract results, handling both response formats
    let results: SearchResult[] = [];
    if (searchResponse.results && Array.isArray(searchResponse.results)) {
      results = searchResponse.results;
    } else if (Array.isArray(searchResponse)) {
      results = searchResponse;
    } else {
      throw new Error('Invalid search results format');
    }

    // Format results
    const formattedResults: FormattedSearchResult[] = results.map((result: SearchResult) => ({
      title: result.title || 'Untitled',
      description: result.summary || result.content || '',
      url: result.url || '#',
      source: result.source || 'Unknown',
      language: language,
      lastUpdated: new Date().toLocaleDateString()
    }));

    // Return search results component
    return (
      <ErrorBoundary>
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults 
            query={query}
            results={formattedResults}
            metadata={searchResponse.metadata}
          />
        </Suspense>
      </ErrorBoundary>
    );

  } catch (error) {
    console.error('Error fetching search results:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return (
      <ServerError 
        error={errorMessage}
        reset={refreshSearch}
      />
    );
  }
}