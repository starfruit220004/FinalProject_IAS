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
  origin: [
    'http://localhost:3000',
    'https://final-project-ias.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SecureLearn API is running.', docs: 'https://final-project-ias.vercel.app' });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', env: process.env.NODE_ENV });
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