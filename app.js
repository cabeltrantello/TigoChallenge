const express = require('express');
const config = require('./src/config/env');
const configureMiddleware = require('./src/config/middleware');
const routes = require('./src/routes');
const { errorHandler } = require('./src/utils/error.util');

const app = express();

// Initialize middleware
configureMiddleware(app);

// Load routes
app.use(routes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.port, () => {
  console.log(`
  🚀 Mock API Server running in ${config.env} mode
  📡 Listening on port ${config.port}
  📊 Database: ${config.dbPath}
  ⏱️  Rate limit: ${config.rateLimit.max} req/${config.rateLimit.windowMs/60000}min
  `);
});

module.exports = app; // For testing
