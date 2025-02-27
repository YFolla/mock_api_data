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
const conversationsRoutes = require('./routes/conversations');

// Initialize Express app
const app = express();

// Configure middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev')); // Logging
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Session configuration - Using a simple hardcoded value for demo purposes only
// For a real production app, you would use a proper environment variable
app.use(session({
  secret: 'mock-api-demo-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    // Set sameSite to 'none' if using HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// API routes
app.use('/api/usage', usageRoutes);
app.use('/api/conversations', conversationsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint for easy verification
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Mock API Data Server is running',
    endpoints: {
      allUsage: '/api/usage',
      userByEmail: '/api/usage/:email',
      usageByTier: '/api/usage/tier/:tier',
      usageSummary: '/api/usage/stats/summary',
      allConversations: '/api/conversations',
      conversationById: '/api/conversations/:id',
      conversationStats: '/api/conversations/stats/summary',
      health: '/health'
    }
  });
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