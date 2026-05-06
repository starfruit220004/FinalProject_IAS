const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment variables immediately
const envPath = fs.existsSync(path.join(__dirname, '.env.local')) 
  ? path.join(__dirname, '.env.local') 
  : path.join(__dirname, '.env');

require('dotenv').config({ path: envPath });

const { initDB } = require('./db');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/content');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://final-project-ias.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running.', docs: 'https://final-project-ias.vercel.app' });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

app.get('/api/health', async (req, res) => {
  try {
    const { prisma } = require('./db');
    const userCount = await prisma.user.count();
    res.json({ 
      status: 'Server is running', 
      db: 'Connected', 
      userTable: 'Available',
      userCount,
      env: process.env.NODE_ENV 
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Server is running', 
      db: 'Error', 
      message: err.message 
    });
  }
});

app.get('/api/debug-db', async (req, res) => {
  try {
    const { pool } = require('./db');
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);
    res.json({ table: 'users', columns: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Specific handler for /api 404s
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const start = async () => {
  // Validate critical environment variables
  const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
  const missingEnv = requiredEnv.filter(env => !process.env[env]);
  
  if (missingEnv.length > 0) {
    console.error(`FATAL: Missing environment variables: ${missingEnv.join(', ')}`);
    process.exit(1);
  }

  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
};

start();