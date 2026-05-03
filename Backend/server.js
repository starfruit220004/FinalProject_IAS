const path = require('path');
const fs = require('fs');

// Load .env.local if it exists, otherwise fallback to .env
const envPath = fs.existsSync(path.join(__dirname, '.env.local')) 
  ? path.join(__dirname, '.env.local') 
  : path.join(__dirname, '.env');

require('dotenv').config({ path: envPath });

const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', env: process.env.NODE_ENV });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const start = async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

start();
