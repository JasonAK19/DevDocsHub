'use server';

export async function refreshSearch(prevState: any, formData: FormData) {
  const query = formData.get('q')?.toString() || '';
  return {
    redirect: {
      destination: `/search?q=${encodeURIComponent(query)}`,
      permanent: false,
    },
  };
}

export async function performSearch(query: string, language?: string) {
  try {
    console.log('Attempting search with:', { query, language });
    
    // Get the absolute base URL for server-side requests
    let baseUrl = '';
    
    // Use origin for absolute URL construction in server components
    if (typeof window === 'undefined') {
      // Server-side: need to construct an absolute URL
      baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    }
    
    // Always use an absolute URL in server components
    const searchUrl = `${baseUrl}/api/search`;
    
    console.log('Using search URL:', searchUrl);
    
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        language: language || 'JavaScript'
      }),
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText} (${response.status})`);
    }

    const data = await response.json();
    
    if (data.success && data.data) {
      return data.data;
    }

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}