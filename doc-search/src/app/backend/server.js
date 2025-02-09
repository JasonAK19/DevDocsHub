const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
    }
));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:3001;"
    );
    next();
  });
  
app.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Create a new user
app.post('/user', async (req, res) => {
    console.log('Received registration request:', req.body); // Debug log
    const { email, name, password } = req.body;
  
    try {
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
  
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
  
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
  
      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
  
    } catch (error) {
      console.error('Registration error:', error); // Debug log
      res.status(400).json({ error: error.message });
    }
  });

  //login a user
  app.post('/login', async (req, res) => {
    console.log('Received login request:', req.body); // Debug log
    const { email, password } = req.body;
  
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      });
  
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
  
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        token
      });
  
    } catch (error) {
      console.error('Login error:', error); // Debug log
      res.status(400).json({ error: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});