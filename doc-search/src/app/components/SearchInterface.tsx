'use client';
import React from 'react';
import { Search, Code, Bookmark, LogOut } from '@/app/components/ui/Icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SearchInterface = () => {
  const router = useRouter();
  const { isGuest, user, logout, enableGuestMode} = useAuth();
  const [selectedTech, setSelectedTech] = useState<string>('React');
  const technologies = ['React', 'Python', 'Node.js', 'TypeScript'];
  const recentSearches = [
    {
      title: 'React useEffect Hook',
      source: 'Documentation from React.dev',
      lastVisited: '2 hours ago'
    },
    {
      title: 'Python Async/Await',
      source: 'Documentation from Python.org',
      lastVisited: '5 hours ago'
    }
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      const language = selectedTech === 'TypeScript' ? 'JavaScript' : selectedTech;
      router.push(`/search?q=${encodeURIComponent(query)}&language=${selectedTech}`);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  const handleLogout = async () => {
    await logout();
    enableGuestMode();
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-gray-900" />
            <span className="font-semibold text-gray-900">DevDocs Hub</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a>
            <a href="/snippets" className="text-gray-600 hover:text-gray-900">Snippets</a>
            {user && !isGuest ? (
              <>
                <a href="/bookmarks" className="text-gray-600 hover:text-gray-900">Bookmarks</a>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={navigateToLogin} className="text-gray-600 hover:text-gray-900">Sign In</button>
                <button onClick={navigateToRegister} className="text-gray-600 hover:text-gray-900">Register</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-300">Search Developer Documentation</h1>
          <p className="mb-8 text-gray-600">
            Search across multiple documentation sources, save code snippets, and organize your research
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch}>
            <div className="mb-8">
              <div className="relative">
                <input
                  name="search"
                  type="text"
                  placeholder="Search documentation (e.g. React hooks, Python decorators)"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:outline-none"
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </form>

          {/* Technology Pills */}
          <div className="mb-16 flex justify-center space-x-4 ">
            {technologies.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedTech === tech 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-8">
            <div className="rounded-lg border border-gray-200 p-6 text-center">
              <Search className="mx-auto mb-4 h-8 w-8 text-gray-700" />
              <h3 className="mb-2 font-semibold text-gray-300">Unified Search</h3>
              <p className="text-sm text-gray-600">
                Search across multiple documentation sources including official docs, Stack Overflow, and GitHub
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 text-center">
              <Code className="mx-auto mb-4 h-8 w-8 text-gray-700" />
              <h3 className="mb-2 font-semibold text-gray-300">Code Snippets</h3>
              <p className="text-sm text-gray-600">
                Extract and organize code snippets with automatic language detection and syntax highlighting
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 text-center">
              <Bookmark className="mx-auto mb-4 h-8 w-8 text-gray-700" />
              <h3 className="mb-2 font-semibold text-gray-300">Bookmarks & Notes</h3>
              <p className="text-sm text-gray-600">
                Save important documentation pages and add personal notes for quick reference
              </p>
            </div>
          </div>

          {/* Recent Searches */}
          <div className="mt-16">
            <h2 className="mb-4 text-left text-xl font-semibold text-gray-300">Recent Searches</h2>
            <div className="grid grid-cols-2 gap-4">
              {recentSearches.map((search) => (
                <div key={search.title} className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-1 font-medium text-gray-300">{search.title}</h3>
                  <p className="text-sm text-gray-600">{search.source}</p>
                  <p className="mt-2 text-xs text-gray-500">Last visited: {search.lastVisited}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <Code className="h-6 w-6" />
                <span className="font-semibold">DevDocs Hub</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Your centralized developer documentation search engine
              </p>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Changelog</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Community</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>GitHub</li>
                <li>Discord</li>
                <li>Twitter</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-sm text-gray-400">
            © 2025 DevDocs Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchInterface;