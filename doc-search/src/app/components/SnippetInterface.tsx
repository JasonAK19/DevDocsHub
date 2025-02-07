import React from 'react';
import { Code, Search, Folder, Copy } from 'lucide-react';

const SnippetInterface = () => {
  const snippets = [
    {
      title: 'React useState Hook',
      language: 'typescript',
      code: 'const [state, setState] = useState(initialState);',
      created: '2 hours ago',
      tags: ['react', 'hooks']
    },
    {
      title: 'Python List Comprehension',
      language: 'python',
      code: 'squares = [x**2 for x in range(10)]',
      created: '5 hours ago',
      tags: ['python', 'lists']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-bold">Code Snippets</h1>
          <p className="mb-8 text-gray-600">
            Save and organize your frequently used code snippets
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search snippets..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Snippets Grid */}
          <div className="grid grid-cols-2 gap-6">
            {snippets.map((snippet) => (
              <div key={snippet.title} className="rounded-lg border border-gray-200 p-6 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{snippet.title}</h3>
                  <Copy className="h-5 w-5 text-gray-500 hover:text-gray-700 cursor-pointer" />
                </div>
                <div className="mt-3 rounded bg-gray-50 p-4">
                  <code className="text-sm">{snippet.code}</code>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {snippet.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">{snippet.created}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Snippet Button */}
          <button className="mt-8 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
            Add New Snippet
          </button>
        </div>
      </main>
    </div>
  );
};

export default SnippetInterface;