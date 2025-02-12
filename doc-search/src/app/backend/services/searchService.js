const esClient = require('../utils/elasticsearchClient');

async function checkElasticsearchStatus() {
  try {
    const health = await esClient.cluster.health();
    console.log('Elasticsearch cluster health:', health);
    return {
      isRunning: true,
      status: health.status
    };
  } catch (error) {
    console.error('Elasticsearch health check failed:', error);
    return {
      isRunning: false,
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

    const searchResponse = await esClient.search({
      index: 'documentation',
      body: {
        query: {
          bool: {
            must: {
              multi_match: {
                query,
                fields: ['title^2', 'content'],
                fuzziness: 'AUTO',
                minimum_should_match: '70%'  // More lenient matching
              }
            },
            filter: [
              { term: { language } },
              { term: { framework } }
            ]
          }
        },
        highlight: {
          fields: {
            title: {},
            content: {
              fragment_size: 150,
              number_of_fragments: 3
            }
          }
        },
        _source: ['title', 'content', 'language', 'framework'],
        size: 10  // Limit results to 10
      }
    });

    if (!searchResponse.hits) {
      console.log('No hits found in response');
      return {
        total: 0,
        results: []
      };
    }

    const total = searchResponse.hits.total.value;
    console.log(`Found ${total} matches`);

    const results = searchResponse.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      title: hit._source.title || '',
      content: hit._source.content || '',
      language: hit._source.language,
      framework: hit._source.framework,
      highlights: hit.highlight || {}
    }));

    return {
      total,
      results
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error(`Search failed: ${error.message}`);
  }
}

module.exports = {
  checkElasticsearchStatus,
  searchDocuments
};