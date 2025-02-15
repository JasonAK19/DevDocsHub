const esClient = require('../utils/elasticsearchClient');
const axios = require('axios');
require('dotenv').config();


const API_CONFIG = {
  github: {
    baseUrl: 'https://api.github.com',
    version: 'application/vnd.github.v3+json',
    token: process.env.GITHUB_API_KEY
  },
  mdn: {
    baseUrl: 'https://developer.mozilla.org/api/v1',
    version: '1'
  },
  readthedocs: {
    baseUrl: 'https://readthedocs.org/api/v3',
    version: '3'
  }
};

// GitHub Docs API
async function fetchGitHubDocs(query, options = {}) {
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

    return searchResponse.data.items.map(item => ({
      title: item.name,
      summary: item.path,
      url: item.html_url,
      score: item.score,
      repository: `${owner}/${repo}`
    }));

  } catch (error) {
    console.error('GitHub API error:', error.message);
    return [];
  }
}

// MDN Web Docs API
async function fetchMDNDocs(query) {
  try {
    const response = await axios.get(`${API_CONFIG.mdn.baseUrl}/search`, {
      params: {
        q: query,
        locale: 'en-US',
        highlight: true
      }
    });
    
    return response.data.documents.map(doc => ({
      title: doc.title,
      summary: doc.summary,
      url: `https://developer.mozilla.org${doc.mdn_url}`,
      score: doc.score
    }));
  } catch (error) {
    console.error('MDN API error:', error.message);
    return [];
  }
}

async function fetchReadTheDocs(query) {
  try {
    const response = await axios.get(`${API_CONFIG.readthedocs.baseUrl}/search/`, {
      params: {
        q: query,
        page_size: 10
      },
      headers: {
        'Accept': 'application/json'
      }
    });
    
    return response.data.results.map(result => ({
      title: result.title,
      project: result.project,
      url: result.link,
      excerpt: result.excerpt
    }));
  } catch (error) {
    console.error('ReadTheDocs API error:', error.message);
    return [];
  }
}

async function checkElasticsearchStatus() {
  try {
    const health = await esClient.cluster.health();
    return {
      isRunning: true,
      status: health.status,
      numberOfNodes: health.number_of_nodes,
      activeShards: health.active_shards
    };
  } catch (error) {
    console.error('Elasticsearch health check failed:', error);
    return {
      isRunning: false,
      status: 'red',
      error: error.message
    };
  }
}

async function searchDocuments(query, language, framework) {
  try {
    const health = await checkElasticsearchStatus();
    if (!health.isRunning) {
      throw new Error('Elasticsearch is not available');
    }

    const [githubDocs, mdnDocs, readtheDocs] = await Promise.all([
      fetchGitHubDocs(query),
      fetchMDNDocs(query),
      fetchReadTheDocs(query)
    ]);

    const combinedResults = {
      github: githubDocs,
      mdn: mdnDocs,
      readthedocs: readtheDocs
    };

    await indexExternalResults(combinedResults);

    return {
      total: Object.values(combinedResults).flat().length,
      results: formatSearchResults(combinedResults),
      metadata: {
        query,
        language,
        framework,
        sources: {
          github: !!githubDocs,
          mdn: mdnDocs.length > 0,
          readthedocs: readtheDocs.length > 0
        }
      }
    };

  } catch (error) {
    console.error('Search error:', error);
    throw new Error(`Search failed: ${error.message}`);
  }
}


function formatSearchResults(combinedResults) {
  return Object.entries(combinedResults)
    .flatMap(([source, results]) => {
      if (!results || results.length === 0) return [];
      
      return Array.isArray(results) ? results.map(result => ({
        ...result,
        source
      })) : [{
        ...results,
        source
      }];
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}

async function indexExternalResults(results) {
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
  } catch (error) {
    console.error('Error indexing external results:', error);
  }
}






module.exports = {
  checkElasticsearchStatus,
  searchDocuments
};