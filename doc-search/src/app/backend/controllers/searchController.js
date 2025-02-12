const searchService = require('../services/searchService');

async function search(req, res) {
  const { query, language, framework } = req.body;

  try {
    // First check if Elasticsearch is accessible
    const status = await searchService.checkElasticsearchStatus();
    if (!status.isRunning) {
      return res.status(503).json({
        error: 'Elasticsearch connection error',
        details: status.error
      });
    }

    const results = await searchService.searchDocuments(query, language, framework);
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      details: error.message
    });
  }
}

module.exports = {
  search
};