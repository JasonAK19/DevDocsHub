'use client';
import React from 'react';
import { Bookmark, Search, Tag, ExternalLink } from 'lucide-react';

const BookmarkInterface = () => {
  const bookmarks = [
    {
      title: 'React Server Components',
      url: 'https://react.dev/reference/react/components',
      description: 'Official documentation about React Server Components',
      tags: ['react', 'server-components'],
      saved: '1 day ago'
    },
    {
      title: 'TypeScript Handbook',
      url: 'https://www.typescriptlang.org/docs/handbook',
      description: 'The official TypeScript documentation guide',
      tags: ['typescript', 'basics'],
      saved: '3 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Bookmarks</h1>
          <p className="mb-8 text-gray-600">
            Your saved documentation and resources
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bookmarks..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Bookmarks List */}
          <div className="space-y-4">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.title} className="rounded-lg border border-gray-200 p-6 text-left">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{bookmark.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{bookmark.description}</p>
                    <a href={bookmark.url} className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      Visit <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <Bookmark className="h-5 w-5 text-gray-500" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {bookmark.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Saved {bookmark.saved}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Bookmark Button */}
          <button className="mt-8 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Add New Bookmark
          </button>
        </div>
      </main>
    </div>
  );
};

export default BookmarkInterface;