import SearchResults from "@/app/components/SearchResults";
import { mockSearchResults } from "@/app/data/mockresults";

export default function SearchResultsPage({
  searchParams
}: {
  searchParams: { q: string }
}) {
  return (
    <SearchResults 
      query={searchParams.q} 
      results={mockSearchResults}
    />
  );
}