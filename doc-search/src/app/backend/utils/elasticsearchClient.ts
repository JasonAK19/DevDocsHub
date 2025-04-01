import { Client } from '@elastic/elasticsearch';
import type { ClientOptions } from '@elastic/elasticsearch';


const clientConfig: ClientOptions = {
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
};


let clientInstance: Client | null = null;


function getElasticsearchClient(): Client {
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

const esClient = getElasticsearchClient();

export default esClient;

// Also export as a named function for testing or re-initialization purposes
export { getElasticsearchClient };