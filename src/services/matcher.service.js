const { matchConditions } = require('./condition.service');
const logger = require('../utils/logger.util');

const matchMethod = (mockMethod, requestMethod) =>
  mockMethod.toUpperCase() === requestMethod.toUpperCase();

const matchQueryParams = (mockParams, requestQuery) => {
  if (!mockParams) return true;

  return Object.entries(mockParams).every(([key, value]) =>
    requestQuery[key] && requestQuery[key] === value
  );
};

const matchPath = (mockPath, requestPath) => {
  try {
    const mockPathSegments = mockPath.split('/').filter(Boolean);
    const requestPathSegments = requestPath.split('/').filter(Boolean);

    if (mockPathSegments.length !== requestPathSegments.length) {
      return false;
    }

    return mockPathSegments.every((segment, i) => 
      segment.startsWith(':') || segment === requestPathSegments[i]
    );
  } catch (error) {
    logger.error(`Path matching error: ${error.message}`);
    return false;
  }
};

const matchRequest = (mocks, req) =>
  mocks.find(mock =>
    matchPath(mock.path, req.path) &&
    matchMethod(mock.method, req.method) &&
    matchQueryParams(mock.queryParams, req.query) &&
    matchConditions(req, mock.conditions)
  );

module.exports = { matchRequest };