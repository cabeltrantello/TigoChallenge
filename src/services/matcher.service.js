const { matchConditions } = require('./condition.service');
const logger = require('../utils/logger.util');

// Match incoming request to mock configurations
const matchRequest = (mocks, req) => {
  return mocks.find(mock => 
    matchPath(mock.path, req.path) &&
    matchMethod(mock.method, req.method) &&
    matchQueryParams(mock.queryParams, req.query) &&
    matchConditions(mock.conditions, req)
  );
};

// Match request path
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

// Match HTTP method
const matchMethod = (mockMethod, requestMethod) => {
  return mockMethod.toUpperCase() === requestMethod.toUpperCase();
};

// Match query parameters
const matchQueryParams = (mockParams, requestQuery) => {
  if (!mockParams) return true;
  
  return Object.entries(mockParams).every(([key, value]) => {
    return requestQuery[key] && requestQuery[key] === value;
  });
};

module.exports = { matchRequest };