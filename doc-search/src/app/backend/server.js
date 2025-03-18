const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const searchDocuments = require('./services/searchService');

const prisma = new PrismaClient();
const app = express();
const router = express.Router();
const port = process.env.PORT || 3001;

const deployedUrl = process.env.NEXTAUTH_URL || 'https://dev-docs-hub.vercel.app';

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [deployedUrl] 
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
  
app.use((req, res, next) => {
  const connectSrc = process.env.NODE_ENV === 'production'
    ? `'self' ${deployedUrl}`
    : "'self' http://localhost:3001";
  
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src ${connectSrc};`
  );
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});


// Only listen on a port in development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    console.error('Server failed to start:', err);
  });
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app; 
