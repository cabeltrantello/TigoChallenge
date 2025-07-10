const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');

const conditionSchema = Joi.object({
  type: Joi.string().valid('header', 'query', 'body').required(),
  key: Joi.string().required(),
  value: Joi.string().required(),
  operator: Joi.string().valid('equals', 'contains', 'regex').default('equals')
});

const mockSchema = Joi.object({
  id: Joi.string().default(uuidv4),
  path: Joi.string().pattern(/^\/[a-zA-Z0-9\-_/]+$/).required(),
  method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH').required(),
  status: Joi.number().integer().min(100).max(599).default(200),
  queryParams: Joi.object().pattern(Joi.string(), Joi.string()),
  headers: Joi.object().pattern(Joi.string(), Joi.string()),
  requestBody: Joi.alternatives().try(Joi.object(), Joi.array()),
  response: Joi.object({
    body: Joi.alternatives().try(Joi.object(), Joi.array(), Joi.string()).required(),
    headers: Joi.object().pattern(Joi.string(), Joi.string()).default({}),
    latency: Joi.number().integer().min(0).default(0)
  }).required(),
  active: Joi.boolean().default(true),
  conditions: Joi.array().items(conditionSchema).default([]),
  createdAt: Joi.date().default(Date.now),
  updatedAt: Joi.date().default(Date.now)
});

const updateSchema = mockSchema.fork(
  ['path', 'method'], 
  schema => schema.optional()
);

// Generate mock data for testing
const generateMockData = () => ({
  id: uuidv4(),
  path: '/api/users',
  method: 'GET',
  status: 200,
  response: {
    body: {
      users: [
        { id: '{{faker.uuid}}', name: 'John Doe' },
        { id: '{{faker.uuid}}', name: 'Jane Smith' }
      ]
    },
    headers: { 'Content-Type': 'application/json' },
    latency: 300
  },
  active: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

module.exports = {
  mockSchema,
  updateSchema,
  generateMockData
};