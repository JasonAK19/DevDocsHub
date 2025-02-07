"use client";
import { SearchResult } from '../types/search';
import { ExternalLink } from 'lucide-react';

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
}

export default function SearchResults({ query, results }: SearchResultsProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="text-xl font-semibold mb-4">
          Results for "{query}"
        </h2>
        <div className="space-y-6">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 hover:border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <a href={result.url} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                    {result.title}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>{result.source}</span>
                {result.language && <span>• {result.language}</span>}
                <span>• {result.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}