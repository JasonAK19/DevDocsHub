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
                fields: ['title^3', 'content^2', 'framework'],
                fuzziness: 'AUTO',
                minimum_should_match: '70%',
                type: 'best_fields',
                tie_breaker: 0.3
              }
            },
            filter: [
              { term: { language } },
              { term: { framework } }
            ]
          }
        },
        highlight: {
          pre_tags: ['<mark>'],
          post_tags: ['</mark>'],
          fields: {
            title: {
              number_of_fragments: 0,
              type: 'unified'
            },
            content: {
              fragment_size: 150,
              number_of_fragments: 3,
              type: 'unified',
              fragmenter: 'span'
            }
          }
        },
        _source: ['title', 'content', 'language', 'framework', 'url'],
        size: 10,
        sort: [{ '_score': 'desc' }],
        track_scores: true,
        track_total_hits: true
      }
    });

    if (!searchResponse.hits) {
      return {
        total: 0,
        results: [],
        metadata: {
          query,
          language,
          framework,
          took: searchResponse.took || 0
        }
      };
    }

    const total = searchResponse.hits.total.value;
    const results = searchResponse.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score !== null ? hit._score.toFixed(2) : 0,
      title: hit._source.title || '',
      content: hit._source.content || '',
      language: hit._source.language,
      framework: hit._source.framework,
      url: hit._source.url || '',
      highlights: {
        title: hit.highlight?.title?.[0] || hit._source.title,
        content: hit.highlight?.content || [],
        relevance: {
          title: hit.highlight?.title ? 'high' : 'none',
          content: hit.highlight?.content?.length || 0
        }
      }
    }));

    return {
      total,
      results,
      metadata: {
        query,
        language,
        framework,
        took: searchResponse.took || 0,
        max_score: searchResponse.hits.max_score !== null ? searchResponse.hits.max_score.toFixed(2) : 0,
        query_terms: query.split(/\s+/).length
      }
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