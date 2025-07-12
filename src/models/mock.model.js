
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid'); 

const conditionSchema = Joi.object({
  source: Joi.string().valid('query', 'headers', 'body', 'params').required(),
  field: Joi.string().required(),
  value: Joi.any().required(),
  operator: Joi.string().valid('equals', 'notEquals', 'includes', 'exists').default('equals')
});

const mockSchema = Joi.object({
  path: Joi.string().pattern(/^\/[a-zA-Z0-9\-_/:]+$/).required(),
  method: Joi.string().valid('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS').uppercase().required(),
  queryParams: Joi.object().pattern(Joi.string(), Joi.string()).optional().default({}),
  headers: Joi.object().pattern(Joi.string(), Joi.string()).optional().default({}),
  response: Joi.object({
    status: Joi.number().integer().min(100).max(599).default(200),
    body: Joi.alternatives().try(Joi.object(), Joi.array(), Joi.string()).default(''),
    headers: Joi.object().pattern(Joi.string(), Joi.string()).default({ 'Content-Type': 'application/json' }),
    latency: Joi.number().integer().min(0).default(0)
  }).required(),
  active: Joi.boolean().default(true),
  conditions: Joi.array().items(conditionSchema).default([]),
});

const updateSchema = Joi.object({
  path: mockSchema.extract('path').optional(),
  method: mockSchema.extract('method').optional(),
  response: mockSchema.extract('response').optional(),
  active: mockSchema.extract('active').optional(),
  conditions: mockSchema.extract('conditions').optional(),
  queryParams: mockSchema.extract('queryParams').optional(),
  headers: mockSchema.extract('headers').optional()
}).min(1);

const generateMockData = () => ({
  id: uuidv4(),
  path: '/api/users',
  method: 'GET',
  response: {
    status: 200,
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
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString() 
});

module.exports = {
  mockSchema,
  updateSchema,
  generateMockData
};