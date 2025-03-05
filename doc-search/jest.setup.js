const { TextEncoder, TextDecoder } = require('util');
const { Readable } = require('stream');

// Setup text encoding
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.ReadableStream = Readable;

// Setup FormData mock with more complete implementation
global.FormData = class FormData {
  constructor() {
    this.data = new Map();
  }
  
  append(key, value) {
    this.data.set(key, value);
  }
  
  get(key) {
    return this.data.get(key) || null;
  }
  
  getAll(key) {
    return this.data.has(key) ? [this.data.get(key)] : [];
  }
  
  has(key) {
    return this.data.has(key);
  }
  
  delete(key) {
    this.data.delete(key);
  }
  
  toString() {
    return '[object FormData]';
  }
};

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    pathname: '/',
    search: '',
    hash: '',
  },
  writable: true,
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};