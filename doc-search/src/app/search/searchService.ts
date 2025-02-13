export interface SearchResponse {
    total: number;
    results: Array<{
      id: string;
      score: number;
      title: string;
      content: string;
      language: string;
      framework: string;
      url: string;
      highlights: {
        title: string;
        content: string[];
        relevance: {
          title: 'high' | 'none';
          content: number;
        };
      };
    }>;
    metadata: {
      query: string;
      language: string;
      framework: string;
      took: number;
      max_score: number;
      query_terms: number;
    };
  }
  
  export async function searchDocumentation(
    query: string,
    language: string = 'JavaScript',
    framework: string = 'React'
  ): Promise<SearchResponse> {
    const normalizedLanguage = language.replace('.js', '').replace('Node', 'JavaScript');
  
    const response = await fetch('http://localhost:3001/search/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query, 
        language: normalizedLanguage,
        framework: framework 
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Search failed: ${await response.text()}`);
    }
  
    const responseText = await response.text();
    console.log('Raw Response Text:', responseText); // Log the raw response text
  
    try {
      const responseData = JSON.parse(responseText);
      console.log('Parsed Response Data:', responseData); // Log the parsed response data
      return responseData;
    } catch (error) {
      console.error('Error parsing response:', error);
      throw new Error(`Failed to parse response: ${responseText}`);
    }
  }