const searchService = require('../services/searchService');

async function search(req, res) {
  try {
    const query = req.method === 'GET' ? req.query.q : req.body.query;
    const language = (req.method === 'GET' ? req.query.language : req.body.language) || 'JavaScript';
    const framework = req.method === 'GET' ? req.query.framework : req.body.framework;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Enhance query for React hooks
    const enhancedQuery = query.toLowerCase().startsWith('use') 
      ? `React ${query} hook`
      : query;

    const results = await searchService.searchDocuments(enhancedQuery, language, framework);
    
    // Check if we have any results, regardless of Elasticsearch status
    if (results.results && results.results.length > 0) {
      return res.json({ 
        success: true, 
        data: {
          ...results,
          metadata: {
            ...results.metadata,
            sources: {
              ...results.metadata.sources,
              elasticsearch: false // Explicitly mark Elasticsearch as unavailable
            }
          }
        }
      });
    }

    // Handle case where we have no results
    if (results.metadata?.error) {
      // Log the Elasticsearch error but don't expose it to the client
      console.warn('Search backend warning:', results.metadata.error);
      return res.json({
        success: true,
        data: {
          total: 0,
          results: [],
          metadata: {
            query: enhancedQuery,
            language,
            framework,
            sources: {
              elasticsearch: false,
              github: results.metadata.sources?.github || false,
              mdn: results.metadata.sources?.mdn || false
            }
          }
        }
      });
    }

    // Return empty results if nothing found
    return res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Search failed',
      details: 'An unexpected error occurred while searching'
    });
  }
}

module.exports = {
  search
};
