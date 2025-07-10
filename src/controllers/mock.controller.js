const db = require('../config/litedb');
const { matchRequest } = require('../services/matcher.service');
const { renderTemplate } = require('../services/templating.service');
const logger = require('../utils/logger.util');
const { formatError } = require('../utils/error.util');

// Handle incoming API requests
const handleMockRequest = async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Retrieve all active mocks
    const mocks = db.getData('/mocks').filter(m => m.active);
    
    // Find matching mock configuration
    const matchedMock = matchRequest(mocks, req);
    
    if (!matchedMock) {
      logger.warn(`No mock found for ${req.method} ${req.path}`);
      return res.status(404).json({ error: 'Mock not found' });
    }
    
    // Apply response latency if configured
    if (matchedMock.response.latency > 0) {
      await new Promise(resolve => 
        setTimeout(resolve, matchedMock.response.latency)
      );
    }
    
    // Set response headers
    Object.entries(matchedMock.response.headers).forEach(([key, value]) => {
      res.set(key, value);
    });
    
    // Render and send response
    const renderedBody = renderTemplate(matchedMock.response.body, req);
    res.status(matchedMock.status).send(renderedBody);
    
    // Log successful request
    logRequest(req, res, startTime, matchedMock.id);
    
  } catch (error) {
    logger.error(`Mock execution error: ${error.message}`);
    res.status(500).json(formatError('Internal server error'));
  }
};

// Log request to database
const logRequest = (req, res, startTime, mockId) => {
  const logEntry = {
    id: uuidv4(),
    mockId,
    method: req.method,
    path: req.path,
    status: res.statusCode,
    latency: Date.now() - startTime,
    timestamp: new Date(),
    request: {
      headers: req.headers,
      query: req.query,
      body: req.body
    }
  };
  
  try {
    db.push('/logs[]', logEntry, true);
  } catch (error) {
    logger.error(`Failed to log request: ${error.message}`);
  }
};

module.exports = { handleMockRequest };