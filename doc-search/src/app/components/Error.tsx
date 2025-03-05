'use client';

interface ErrorProps {
  error: string;
  reset?: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-xl font-semibold mb-2 text-red-600">Error</h2>
      <p className="text-red-500 mb-4">{error}</p>
      {reset && (
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
        >
          Try Again
        </button>
      )}
    </div>
  );
}