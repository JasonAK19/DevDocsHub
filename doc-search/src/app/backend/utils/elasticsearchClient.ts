import { Client } from '@elastic/elasticsearch';
import type { ClientOptions } from '@elastic/elasticsearch';

const node = process.env.ELASTICSEARCH_NODE;

if (!node) {
  console.warn('ELASTICSEARCH_NODE is not set. Elasticsearch client will not be initialized.');
}

const clientConfig: ClientOptions = {
  node,
};

let clientInstance: Client | null = null;

function getElasticsearchClient(): Client {
  if (!node) {
    throw new Error('Elasticsearch client cannot be initialized because ELASTICSEARCH_NODE is not configured.');
  }

  if (!clientInstance) {
    try {
      clientInstance = new Client(clientConfig);
      console.log(`Elasticsearch client initialized with node: ${clientConfig.node}`);
    } catch (error) {
      console.error('Failed to create Elasticsearch client:', error);
      throw error;
    }
  }
  return clientInstance;
}

const esClient = node ? getElasticsearchClient() : null;

export default esClient;
export { getElasticsearchClient };