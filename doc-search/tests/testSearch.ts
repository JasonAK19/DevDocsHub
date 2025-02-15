const axios = require('axios');
const dotenv = require('dotenv');
import { AxiosError } from 'axios';

dotenv.config();

async function testSearch(params = {}) {
  try {
    const defaultParams = {
      query: 'async await',
      language: 'JavaScript',
      framework: 'React'
    };

    const searchParams = { ...defaultParams, ...params };
    
    const response = await axios.post('http://localhost:3001/search', searchParams);
    console.log('Search Results:', JSON.stringify(response.data, null, 2));
    
    // Log source distribution
    console.log('\nSource Distribution:');
    const sources = response.data.metadata.sources;
    Object.entries(sources).forEach(([source, active]) => {
      console.log(`${source}: ${active ? '✓' : '✗'}`);
    });

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error('Search failed:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        data: axiosError.response?.data
      });
    } else {
      console.error('Search failed:', error instanceof Error ? error.message : String(error));
    }
  }
}

// Test different scenarios
async function runTests() {
  console.log('=== Testing GitHub TypeScript Documentation ===');
  await testSearch({
    query: 'interfaces',
    language: 'TypeScript',
    source: 'github',
    owner: 'microsoft',
    repo: 'TypeScript'
  });

  console.log('\n=== Testing React Documentation ===');
  await testSearch({
    query: 'hooks',
    language: 'JavaScript',
    framework: 'React',
    source: 'github',
    owner: 'facebook',
    repo: 'react'
  });
}

runTests();