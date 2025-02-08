export default function SearchSkeleton() {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Search Query Skeleton */}
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
          
          {/* Results Skeleton */}
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg p-4">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }