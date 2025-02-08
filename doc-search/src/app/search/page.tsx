import SearchResults from "@/app/components/SearchResults";
import SearchSkeleton from "../components/loading/SearchSkeleton";
import { mockSearchResults } from "../data/mockresults";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>
}

export default async function SearchResultsPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  
  if (!params.q) {
    return <div>Please enter a search query</div>;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults 
        query={params.q} 
        results={mockSearchResults}
      />
    </Suspense>
  );
}