export default function SnippetSkeleton() {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-lg border p-4">
                {/* Title */}
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
                {/* Code block */}
                <div className="h-32 bg-gray-100 rounded animate-pulse mb-4"></div>
                {/* Tags */}
                <div className="flex gap-2">
                  <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }