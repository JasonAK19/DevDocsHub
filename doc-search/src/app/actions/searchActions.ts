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
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/search`, {
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
      throw new Error(`Search failed with status: ${response.status}`);
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