/**
 * Main server file for the API
 * Configures Express with middleware and routes
 */

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const usageRoutes = require('./routes/usage');

// Initialize Express app
const app = express();

// Configure middleware
app.use(morgan('dev')); // Logging
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Session configuration - Using a simple hardcoded value for demo purposes only
// For a real production app, you would use a proper environment variable
app.use(session({
  secret: 'mock-api-demo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// API routes
app.use('/api/usage', usageRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; // Export for testing 