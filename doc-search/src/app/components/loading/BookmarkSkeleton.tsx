export default function BookmarkSkeleton() {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-lg border p-6">
                {/* Title */}
                <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-3"></div>
                {/* Description */}
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
                {/* URL */}
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }