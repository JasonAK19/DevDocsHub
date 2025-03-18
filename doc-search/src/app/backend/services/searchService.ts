import axios from 'axios';
import esClient from '../utils/elasticsearchClient';

// Type definitions
interface ApiConfig {
  github: {
    baseUrl: string;
    version: string;
    token: string | undefined;
  };
  mdn: {
    baseUrl: string;
    version: string;
  };
}

interface GitHubDocsOptions {
  owner?: string;
  repo?: string;
}

interface GitHubResult {
  title: string;
  summary: string;
  url: string;
  score: number;
  repository: string;
}

interface MDNResult {
  title: string;
  summary: string;
  url: string;
  score: number;
}

interface SearchResult {
  id?: string;
  title: string;
  summary?: string;
  content?: string;
  url: string;
  score?: number;
  source?: string;
  repository?: string;
}

interface ElasticsearchStatus {
  isRunning: boolean;
  status: string;
  numberOfNodes?: number;
  activeShards?: number;
  error?: string;
}

interface CombinedResults {
  github: GitHubResult[];
  mdn: MDNResult[];
}

interface SearchMetadata {
  query: string;
  language: string;
  framework: string | null | undefined;
  error?: string;
  sources: {
    elasticsearch: boolean;
    github: boolean;
    mdn: boolean;
  };
}

interface SearchResponse {
  total: number;
  results: SearchResult[];
  metadata: SearchMetadata;
}

// API Configuration
const API_CONFIG: ApiConfig = {
  github: {
    baseUrl: 'https://api.github.com',
    version: 'application/vnd.github.v3+json',
    token: process.env.GITHUB_API_KEY
  },
  mdn: {
    baseUrl: 'https://developer.mozilla.org/api/v1',
    version: '1'
  }
};

// GitHub Docs API
async function fetchGitHubDocs(query: string, options: GitHubDocsOptions = {}): Promise<GitHubResult[]> {
  const { owner = 'microsoft', repo = 'TypeScript' } = options;
  
  try {
    const searchResponse = await axios.get(`${API_CONFIG.github.baseUrl}/search/code`, {
      params: {
        q: `${query} repo:${owner}/${repo}`,
        per_page: 10
      },
      headers: {
        'Accept': API_CONFIG.github.version,
        'Authorization': `Bearer ${API_CONFIG.github.token}`
      }
    });

    return searchResponse.data.items.map((item: any) => ({
      title: item.name,
      summary: item.path,
      url: item.html_url,
      score: item.score,
      repository: `${owner}/${repo}`
    }));

  } catch (error: any) {
    console.error('GitHub API error:', error.message);
    return [];
  }
}

// MDN Web Docs API
async function fetchMDNDocs(query: string): Promise<MDNResult[]> {
  try {
    const response = await axios.get(`${API_CONFIG.mdn.baseUrl}/search`, {
      params: {
        q: query,
        locale: 'en-US',
        highlight: true
      }
    });
    
    return response.data.documents.map((doc: any) => ({
      title: doc.title,
      summary: doc.summary,
      url: `https://developer.mozilla.org${doc.mdn_url}`,
      score: doc.score
    }));
  } catch (error: any) {
    console.error('MDN API error:', error.message);
    return [];
  }
}

async function checkElasticsearchStatus(): Promise<ElasticsearchStatus> {
  try {
    const health = await esClient.cluster.health();
    return {
      isRunning: true,
      status: health.status,
      numberOfNodes: health.number_of_nodes,
      activeShards: health.active_shards
    };
  } catch (error: any) {
    console.error('Elasticsearch health check failed:', error);
    return {
      isRunning: false,
      status: 'red',
      error: error.message
    };
  }
}

function generateResultId(result: SearchResult, source: string): string {
  return Buffer.from(`${source}-${result.url || result.title || JSON.stringify(result)}`).toString('base64');
}

async function formatSearchResults(combinedResults: CombinedResults): Promise<SearchResult[]> {
  return Object.entries(combinedResults)
    .flatMap(([source, results]) => {
      if (!results || results.length === 0) return [];
      
      return Array.isArray(results) ? results.map(result => ({
        ...result,
        id: generateResultId(result, source),
        source
      })) : [{
        ...results,
        id: generateResultId(results, source),
        source
      }];
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}

async function indexExternalResults(results: CombinedResults): Promise<void> {
  try {
    const bulkBody = Object.entries(results).flatMap(([source, docs]) => {
      if (!docs) return [];
      const documents = Array.isArray(docs) ? docs : [docs];
      
      return documents.flatMap(doc => [
        { index: { _index: 'external_docs' } },
        {
          ...doc,
          source,
          timestamp: new Date(),
          type: 'external'
        }
      ]);
    });

    if (bulkBody.length > 0) {
      await esClient.bulk({ body: bulkBody });
    }
  } catch (error: any) {
    console.error('Error indexing external results:', error);
  }
}

async function searchDocuments(
  query: string, 
  language: string = 'JavaScript', 
  framework: string | null = null
): Promise<SearchResponse> {
  try {
    // Try to check Elasticsearch but don't block the entire search if it fails
    let elasticsearchAvailable = false;
    try {
      const health = await checkElasticsearchStatus();
      elasticsearchAvailable = health.isRunning;
    } catch (error) {
      console.warn('Elasticsearch check failed:', error);
    }

    // Fetch results from external APIs regardless of Elasticsearch status
    const [githubDocs, mdnDocs] = await Promise.all([
      fetchGitHubDocs(query),
      fetchMDNDocs(query),
    ]);

    const combinedResults: CombinedResults = {
      github: githubDocs,
      mdn: mdnDocs,
    };

    // Only try to index if Elasticsearch is available
    if (elasticsearchAvailable) {
      try {
        await indexExternalResults(combinedResults);
      } catch (error) {
        console.error('Failed to index results:', error);
        // Continue without indexing
      }
    }

    return {
      total: Object.values(combinedResults).flat().length,
      results: await formatSearchResults(combinedResults),
      metadata: {
        query,
        language,
        framework,
        sources: {
          elasticsearch: elasticsearchAvailable,
          github: Array.isArray(githubDocs) && githubDocs.length > 0,
          mdn: Array.isArray(mdnDocs) && mdnDocs.length > 0
        }
      }
    };

  } catch (error: any) {
    console.error('Search error:', error);
    // Return partial results if available instead of throwing
    return {
      total: 0,
      results: [],
      metadata: {
        query,
        language,
        framework,
        error: error.message,
        sources: {
          elasticsearch: false,
          github: false,
          mdn: false
        }
      }
    };
  }
}

export {
  checkElasticsearchStatus,
  searchDocuments,
  type SearchResponse,
  type SearchResult
};