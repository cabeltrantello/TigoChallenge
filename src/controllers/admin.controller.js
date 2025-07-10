const db = require('../config/litedb');
const { mockSchema, updateSchema } = require('../models/mock.model');
const validate = require('../services/validation.service');
const logger = require('../utils/logger.util');
const { formatError } = require('../utils/error.util');

// Create new mock configuration
const createMock = async (req, res) => {
  try {
    const validated = await validate(req.body, mockSchema);
    db.push('/mocks[]', validated);
    
    logger.info(`Created mock: ${validated.method} ${validated.path}`);
    res.status(201).json(validated);
    
  } catch (error) {
    handleValidationError(res, error);
  }
};

// Get all mock configurations
const getAllMocks = (req, res) => {
  try {
    const mocks = db.getData('/mocks');
    res.json(mocks);
  } catch (error) {
    logger.error(`Failed to retrieve mocks: ${error.message}`);
    res.status(500).json(formatError('Database error'));
  }
};

// Update mock configuration
const updateMock = async (req, res) => {
  try {
    const id = req.params.id;
    const mocks = db.getData('/mocks');
    const index = mocks.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res.status(404).json(formatError('Mock not found'));
    }
    
    const validated = await validate(req.body, updateSchema);
    const updatedMock = { ...mocks[index], ...validated, updatedAt: new Date() };
    
    db.push(`/mocks[${index}]`, updatedMock);
    
    logger.info(`Updated mock: ${updatedMock.method} ${updatedMock.path}`);
    res.json(updatedMock);
    
  } catch (error) {
    handleValidationError(res, error);
  }
};

// Delete mock configuration
const deleteMock = (req, res) => {
  try {
    const id = req.params.id;
    const mocks = db.getData('/mocks');
    const index = mocks.findIndex(m => m.id === id);
    
    if (index === -1) {
      return res.status(404).json(formatError('Mock not found'));
    }
    
    const [deleted] = db.delete(`/mocks[${index}]`);
    logger.info(`Deleted mock: ${deleted.method} ${deleted.path}`);
    res.status(204).send();
    
  } catch (error) {
    logger.error(`Delete failed: ${error.message}`);
    res.status(500).json(formatError('Deletion error'));
  }
};

// Handle validation errors
const handleValidationError = (res, error) => {
  if (error.name === 'ValidationError') {
    logger.warn(`Validation error: ${error.message}`);
    return res.status(400).json(formatError(error.message, error.details));
  }
  
  logger.error(`Controller error: ${error.message}`);
  res.status(500).json(formatError('Internal server error'));
};

module.exports = {
  createMock,
  getAllMocks,
  updateMock,
  deleteMock
};