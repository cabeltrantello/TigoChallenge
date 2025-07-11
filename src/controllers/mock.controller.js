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

const handleMockRequest = async (req, res) => {
    const startTime = Date.now();

    try {
        const mocks = db.getData('/mocks').filter(m => m.active);
        const matchedMock = matchRequest(mocks, req);

        if (!matchedMock) {
            logger.warn(`No mock found for ${req.method} ${req.path}`);
            return res.status(404).json({ error: 'Mock not found' });
        }

        if (matchedMock.response.latency > 0) {
            await new Promise(resolve => {
              setTimeout(() => {
              resolve();
            }, matchedMock.response.latency);
});
        }

        Object.entries(matchedMock.response.headers).forEach(([key, value]) => {
            res.set(key, value);
        });

        const renderedBody = renderTemplate(matchedMock.response.body, req);

        res.status(matchedMock.status);
        logRequest(req, res, startTime, matchedMock.id);

        return res.send(renderedBody);

    } catch (error) {
        logger.error(`Mock execution error: ${error.message}`);
        res.status(500);

        return res.json(formatError('Internal server error'));
    }
};

module.exports = { handleMockRequest };