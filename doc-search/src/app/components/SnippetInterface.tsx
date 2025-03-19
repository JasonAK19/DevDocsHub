"use client";

import { useState, useEffect } from 'react';
import { Code, Search, Folder, Copy, Plus, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface CodeSnippet {
  id: string;
  title: string;
  code: string;
  language: string;
  description?: string;
  tags: string[];
  createdAt: string;
}

const SnippetInterface = () => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login?callbackUrl=' + encodeURIComponent('/snippets'));
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.id) {
      fetchSnippets();
    }
  }, [user]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching snippets for user:", user?.id);
      
      const response = await fetch(`/api/snippets?userId=${user?.id}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch snippets:', errorText);
        setError(`Failed to fetch snippets: ${response.status}`);
        return;
      }
      
      const data = await response.json();
      console.log("Received snippets:", data);
      setSnippets(data);
    } catch (error) {
      console.error('Error fetching snippets:', error);
      setError('Failed to fetch snippets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    try {
      setIsSubmitting(true);
      
      const tagArray = tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
        
      // Include userId both as query param and in request body
      const response = await fetch(`/api/snippets?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  
        body: JSON.stringify({
          title,
          code,
          language,
          description,
          tags: tagArray,
          userId: user.id
        }),
      });
  
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || 'Failed to create snippet';
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }
  
      // Reset form
      setTitle('');
      setCode('');
      setLanguage('javascript');
      setDescription('');
      setTags('');
      
      // Close modal and refresh snippets
      setIsModalOpen(false);
      fetchSnippets();
    } catch (error) {
      console.error('Error creating snippet:', error);
      setError(error instanceof Error ? error.message : 'Failed to create snippet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  const filteredSnippets = searchQuery 
    ? snippets.filter(snippet => 
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : snippets;

  if (isLoading || (!user && !loading)) {
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
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 ">Code Snippets</h1>
            <button 
              onClick={() => router.push('/search/interface')} 
              className="flex items-center px-3 py-2 text-sm text-gray-800 hover:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Search
            </button>
          </div>
          <p className="mb-8 text-gray-600">
            Save and organize your frequently used code snippets
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {error && (
            <div className="mb-6 p-4 text-sm text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Snippets Grid */}
          {loading ? (
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading snippets...</p>
            </div>
          ) : filteredSnippets.length === 0 ? (
            <div className="text-center py-8">
              <Code className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'No snippets match your search' : 'You haven\'t created any snippets yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSnippets.map((snippet) => (
                <div key={snippet.id} className="rounded-lg border border-gray-200 p-6 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-300">{snippet.title}</h3>
                    <Copy 
                      className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" 
                      onClick={() => copyToClipboard(snippet.code)}
                    />
                  </div>
                  <div className="mt-3 rounded bg-gray-50 p-4 text-gray-600">
                    <code className="text-sm">{snippet.code}</code>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {snippet.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Snippet Button */}
          <button 
            className="mt-8 rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-gray-600 flex items-center mx-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5 mr-2" /> Add New Snippet
          </button>
        </div>
      </main>
      
      {/* Add Snippet Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Snippet</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={6}
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="java">Java</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="go">Go</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="sql">SQL</option>
                  <option value="bash">Bash</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="react, hooks, etc."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 rounded-md text-sm font-medium text-white hover:bg-gray-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Snippet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnippetInterface;