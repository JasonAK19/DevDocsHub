"use client";
import { useState, useEffect, useMemo } from 'react';
import { SearchResult as SearchResultType } from '../types/search';
import { ExternalLink, Bookmark, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';


interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  source: string;
  language: string;
  lastUpdated: string;
}

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  userId?: string; 
}

export default function SearchResults({ query, results, userId: propUserId }: SearchResultsProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const userId = user?.id || propUserId;
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [bookmarksFetched, setBookmarksFetched] = useState(false);
  const [idMapping, setIdMapping] = useState<Record<string, string>>({});

   // Debug logging
  useEffect(() => {
    console.log("Auth state:", { user, isLoading, userId: user?.id, propUserId });
  }, [user, isLoading, propUserId]);
  
  useEffect(() => {
    if (userId && !bookmarksFetched) {
      fetchUserBookmarks();
    }
  }, [userId, bookmarksFetched]);

  useEffect(() => {
    setBookmarksFetched(false); 
    if (userId) {
      fetchUserBookmarks();
    }
  }, [query]);

  
  const fetchUserBookmarks = async () => {
    if (!userId) return;
    
    try {
      console.log("Fetching bookmarks for user:", userId);
      const response = await fetch(`/api/bookmarks?userId=${userId}&includePages=true`, {
        credentials: 'include'
      });
  
      if (!response.ok) {
        console.error(`Failed to fetch bookmarks: ${response.status} ${response.statusText}`);
        // Log the error response
        try {
          const errorText = await response.text();
          console.error('Error response:', errorText);
        } catch (e) {
          console.error('Could not read error response');
        }
        return;
      }
  
      const bookmarks = await response.json();
      console.log("Received bookmarks:", bookmarks);
  
      const mapping: Record<string, string> = {};
      const bookmarkedIds = new Set<string>();
  
      bookmarks.forEach((bookmark: any) => {
        // Always add the database pageId
        bookmarkedIds.add(bookmark.pageId);
        
        if (bookmark.page && bookmark.page.url) {
          // Generate the URL-based ID that matches search results
          const generatedId = btoa(bookmark.page.url);
          bookmarkedIds.add(generatedId);
          mapping[generatedId] = bookmark.pageId;
        }
      });
  
      console.log("Bookmark ID mapping:", mapping);
      console.log("Setting bookmarked items:", Array.from(bookmarkedIds));
      setIdMapping(mapping);
      setBookmarkedItems(bookmarkedIds);
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    }
    setBookmarksFetched(true);
  };

  const isBookmarked = (result: SearchResult) => {
    // 1. Check if result.id exists in bookmarkedItems
    if (bookmarkedItems.has(result.id)) {
      return true;
    }
    
    // 2. Generate and check a URL-based ID
    const urlId = btoa(result.url);
    if (bookmarkedItems.has(urlId)) {
      return true;
    }
    
    // 3. Check for other IDs that might have been generated differently
    const combinedId = btoa(`${result.url || ''}${result.title || ''}`);
    if (bookmarkedItems.has(combinedId)) {
      return true;
    }
    
    // Not bookmarked
    return false;
  };
  
  const toggleBookmark = async (result: SearchResult) => {
    if (!userId) {
      console.log("No user ID available. Auth state:", { user, isLoading });
      
      if (confirm("Please sign in to bookmark pages. Would you like to sign in now?")) {
        router.push('/auth/login?callbackUrl=' + encodeURIComponent(window.location.href));
      }
      return;
    }
    
    console.log("Toggling bookmark for user:", userId, "page:", result.id);
    const isCurrentlyBookmarked = bookmarkedItems.has(result.id);
    
    try {
      console.log("Making request:", {
        method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
        url: '/api/bookmarks',
        body: { userId, pageId: result.id }
      });
      
      if (!result.id) {
        console.error("Cannot bookmark: Missing page ID");
        return;
      }

      const response = await fetch('/api/bookmarks', {
        method: isCurrentlyBookmarked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          pageId: result.id,
          url: result.url,
          title: result.title,
        }),
      });
      
      console.log("Bookmark API response:", response.status);

    const responseText = await response.text();
    console.log("Response text:", responseText);
    
      
      if (response.ok) {
        // Update local state
        const newBookmarkedItems = new Set(bookmarkedItems);
        if (isCurrentlyBookmarked) {
          newBookmarkedItems.delete(result.id);
        } else {
          newBookmarkedItems.add(result.id);
        }
        setBookmarkedItems(newBookmarkedItems);
        
        // Try to parse the response, but don't fail if it's empty
        try {
          const data = await response.json();
          console.log("Bookmark response data:", data);
        } catch (jsonError) {
          console.log("No JSON response or empty body");
        }
      } else {
        try {
          const errorData = await response.json();
          console.error("API error:", errorData);
        } catch (jsonError) {
          console.error("API error:", response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  const processedResults = useMemo(() => {
    console.log("Processing raw search results:", results);
  
  return results.map((result, index) => {
    if (!result.id) {
      const generatedId = btoa(`${result.url || ''}${result.title || ''}${index}`);
      console.log(`Generated ID for result ${index}:`, { 
        title: result.title, 
        generatedId 
      });
      
      return {
        ...result,
        id: generatedId
      };
    }
    return result;
  });
}, [results]);


  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Results for "{query}"
          </h2>
          <button 
            onClick={() => router.push('/search/interface')} 
            className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search
          </button>
        </div>
        <div className="space-y-6">
          {processedResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 hover:border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <a href={result.url} className="text-lg font-medium text-blue-600 hover:text-blue-800">
                    {result.title}
                  </a>
                  <p className="text-sm text-gray-600 mt-1">{result.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => toggleBookmark(result)}
                    className="p-1 hover:text-blue-600"
                    aria-label={bookmarkedItems.has(result.id) ? "Remove bookmark" : "Add bookmark"}
                  >
                    <Bookmark 
                      className={`h-5 w-5 ${isBookmarked(result) ? "fill-blue-500 text-blue-500" : "text-gray-400"}`} 
                    />
                  </button>
                  <button 
                    onClick={() => window.open(result.url, '_blank')}
                    className="p-1 hover:text-gray-600"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
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