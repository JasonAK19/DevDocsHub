"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ExternalLink, Bookmark, Folder, Trash2, ArrowLeft} from 'lucide-react';

interface BookmarkItem {
  id: string;
  pageId: string;
  userId: string;
  createdAt: string;
  page?: {
    id: string;
    url: string;
    title: string;
  };
}

export default function BookmarkInterface() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent('/bookmarks/interface'));
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.id) {
      fetchBookmarks();
    }
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching bookmarks for user:", user?.id);
      
      const response = await fetch(`/api/bookmarks?userId=${user?.id}&includePages=true`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch bookmarks:', errorText);
        setError(`Failed to fetch bookmarks: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      console.log("Received bookmarks:", data);
      
      // Filter out bookmarks that don't have page information
      const validBookmarks = data.filter((bookmark: BookmarkItem) => bookmark.page);
      setBookmarks(validBookmarks);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Failed to fetch bookmarks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: string) => {
    if (!confirm('Are you sure you want to remove this bookmark?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/bookmarks/${bookmarkId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        // Remove the bookmark from state
        setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
      } else {
        const errorText = await response.text();
        console.error('Failed to delete bookmark:', errorText);
        setError('Failed to delete bookmark. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      setError('Failed to delete bookmark. Please try again.');
    }
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-4">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold flex items-center">
            <Bookmark className="mr-2 h-6 w-6" /> Your Bookmarks
          </h1>
          <button 
            onClick={() => router.push('/search/interface')} 
            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search
          </button>
        </div>

        {loading ? (
          <div className="text-center p-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading bookmarks...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">You haven't bookmarked any pages yet.</p>
            <button 
              onClick={() => router.push('/search/interface')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Start exploring
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookmarks.map(bookmark => (
              <div key={bookmark.id} className="border rounded-lg p-4 hover:border-blue-300">
                <div className="flex justify-between items-start">
                  <div>
                    <a 
                      href={bookmark.page?.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-lg font-medium text-blue-600 hover:text-blue-800"
                    >
                      {bookmark.page?.title || 'Untitled Page'}
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => removeBookmark(bookmark.id)}
                      className="p-1 hover:text-red-600"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </button>
                    <button 
                      onClick={() => bookmark.page?.url && window.open(bookmark.page.url, '_blank')}
                      className="p-1 hover:text-gray-600"
                      aria-label="Open in new tab"
                    >
                      <ExternalLink className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}