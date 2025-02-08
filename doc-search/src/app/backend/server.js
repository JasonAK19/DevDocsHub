const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/user', async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({
    data: {
      email,
      name,
    },
  });
  res.json(user);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});