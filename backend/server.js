const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('❌ MONGO_URL is not set in .env');
  process.exit(1);
}

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB
async function connectMongoose() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('✅ MongoDB connected via Mongoose');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

// Import Routes
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const invoicesRoutes = require('./routes/invoices');
const customersRoutes = require('./routes/customers');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');





// Route Mounting
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ message: '✅ Quotation Management API is running!' });
});

// Default root
app.get('/', (req, res) => {
  res.send('🌐 Welcome to the Quotation Management API');
});

// Start Server
async function startServer() {
  await connectMongoose();

  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

startServer();
