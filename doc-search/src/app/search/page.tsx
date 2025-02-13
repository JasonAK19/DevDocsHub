import SearchResults from "@/app/components/SearchResults";
import SearchSkeleton from "../components/loading/SearchSkeleton";
import { searchDocumentation } from "./searchService";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    language?: string;
    framework?: string;
  }>
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  
  if (!params.q) {
    return <div>Please enter a search query</div>;
  }

  try {
    const searchResponse = await searchDocumentation(
      params.q,
      params.language || 'JavaScript'
    );
  
    const formattedResults = searchResponse.results.map(result => ({
      title: result.highlights.title || result.title,
      description: result.highlights.content[0] || result.content,
      url: result.url,
      source: result.framework,
      language: result.language,
      lastUpdated: new Date().toLocaleDateString()
    }));


  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults 
        query={params.q} 
        results={formattedResults}
      />
    </Suspense>
  );
}catch (error) {
  return (
    <div className="p-4 text-red-500">
      Error performing search: {(error as Error).message}
    </div>
  );
}
}