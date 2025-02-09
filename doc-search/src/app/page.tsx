import Link from 'next/link';
import { Code, Search, Bookmark, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your Developer Documentation Hub
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Search, save, and organize documentation from multiple sources in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link 
                href="/auth/register" 
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Get Started
              </Link>
              <Link 
                href="/auth/login" 
                className="rounded-md px-6 py-3 text-sm font-semibold text-gray-900 hover:text-blue-600"
              >
                Sign In <ArrowRight className="ml-2 h-4 w-4 inline" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in one place
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
              <div className="relative pl-16">
                <Search className="absolute left-0 top-0 h-10 w-10 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Unified Search
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Search across multiple documentation sources in one go
                </p>
              </div>
              <div className="relative pl-16">
                <Code className="absolute left-0 top-0 h-10 w-10 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Code Snippets
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Save and organize useful code snippets
                </p>
              </div>
              <div className="relative pl-16">
                <Bookmark className="absolute left-0 top-0 h-10 w-10 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Bookmarks
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Save and organize documentation for quick access
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-blue-100">
              Join thousands of developers who are already using DevDocs Hub
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link 
                href="/auth/register" 
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}