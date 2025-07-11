const { v4: uuidv4 } = require('uuid');
const db = require('../config/litedb');
const { matchRequest } = require('../services/matcher.service');
const { renderTemplate } = require('../services/templating.service');
const logger = require('../utils/logger.util');
const { formatError } = require('../utils/error.util');

const logRequest = (req, res, startTime, mockId) => {
  const logEntry = {
    id: uuidv4(),
    mockId,
    method: req.method,
    path: req.path,
    status: res.statusCode,
    latency: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    request: {
      headers: req.headers,
      query: req.query,
      body: req.body
    }
  };

  try {
    // Aquí también espera si db.push es async
    const pushResult = db.push('/logs[]', logEntry, true);
    if (pushResult instanceof Promise) {
      pushResult.catch(error => {
        logger.error(`Failed to log request: ${error.message}`, error);
      });
    }
  } catch (error) {
    logger.error(`Failed to log request: ${error.message}`, error);
  }
};

const handleMockRequest = async (req, res, next) => {
  const startTime = Date.now();

  if (req.path.startsWith('/admin')) {
    return next();
  }

  try {
    let allStoredMocks = await db.getData('/mocks');

    console.log('📦 RAW /mocks:', allStoredMocks);
    console.log('🧪 Is array:', Array.isArray(allStoredMocks));

    if (!Array.isArray(allStoredMocks)) {
      if (typeof allStoredMocks === 'object' && allStoredMocks !== null) {
        logger.warn('Mocks data is not an array. Converting object to array...');
        allStoredMocks = Object.values(allStoredMocks);
      } else {
        logger.warn('Mocks data invalid. Reinitializing...');
        allStoredMocks = [];
        await db.push('/mocks', [], true);
      }
    }

    const activeMocks = allStoredMocks.filter(m => m.active);
    const matchedMock = matchRequest(activeMocks, req);

    if (!matchedMock) {
      logger.warn(`No mock found for ${req.method} ${req.path}`);
      return res.status(404).json(formatError('Mock not found'));
    }

    if (matchedMock.response.latency > 0) {
      await new Promise(resolve => {setTimeout(resolve, matchedMock.response.latency)});
    }

    Object.entries(matchedMock.response.headers || {}).forEach(([key, value]) => {
      res.set(key, value);
    });

    const renderedBody = renderTemplate(matchedMock.response.body, req);

    res.status(matchedMock.response.status);
    logRequest(req, res, startTime, matchedMock.id);

    return res.send(renderedBody);
  } catch (error) {
    logger.error(`Mock execution error: ${error.message}`, error);
    return res.status(500).json(formatError('Internal server error during mock execution'));
  }
};

module.exports = { handleMockRequest };
