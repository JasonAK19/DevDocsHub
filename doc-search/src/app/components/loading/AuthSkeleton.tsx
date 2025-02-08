export default function AuthSkeleton() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8">
          {/* Logo */}
          <div className="h-12 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-6"></div>
          {/* Title */}
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-8"></div>
          {/* Form fields */}
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }