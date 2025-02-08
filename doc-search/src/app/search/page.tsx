import SearchResults from "@/app/components/SearchResults";
import SearchSkeleton from "@/app/components/loading/SearchSkeleton";
import { mockSearchResults } from "@/app/data/mockresults";
import { Suspense } from "react";

export default function SearchResultsPage({
  searchParams
}: {
  searchParams: { q: string }
}) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults 
        query={searchParams.q} 
        results={mockSearchResults}
      />
    </Suspense>
  );
}