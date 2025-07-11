const db = require('../config/litedb');
const { mockSchema, updateSchema } = require('../models/mock.model');
const validate = require('../services/validation.service');
const logger = require('../utils/logger.util');
const { formatError } = require('../utils/error.util');

// Handle validation errors - MOVIDA AL PRINCIPIO
const handleValidationError = (res, error) => {
  if (error.name === 'ValidationError') {
    logger.warn(`Validation error: ${error.message}`);
    return res.status(400).json(formatError(error.message, error.details));
  }

  logger.error(`Controller error: ${error.message}`);
  return res.status(500).json(formatError('Internal server error'));
};

// Create new mock configuration
const createMock = async (req, res) => {
  try {
    const validated = await validate(req.body, mockSchema);
    db.push('/mocks[]', validated);

    logger.info(`Created mock: ${validated.method} ${validated.path}`);
    return res.status(201).json(validated); // Añadido 'return'

  } catch (error) {
    return handleValidationError(res, error); // Añadido 'return'
  }
};

// Get all mock configurations
const getAllMocks = (req, res) => {
  try {
    const mocks = db.getData('/mocks');
    return res.json(mocks); // Añadido 'return'
  } catch (error) {
    logger.error(`Failed to retrieve mocks: ${error.message}`);
    return res.status(500).json(formatError('Database error')); // Añadido 'return'
  }
};

// Update mock configuration
const updateMock = async (req, res) => {
  try {
    const { id } = req.params; // Aplicada desestructuración
    const mocks = db.getData('/mocks');
    const index = mocks.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json(formatError('Mock not found'));
    }

    const validated = await validate(req.body, updateSchema);
    const updatedMock = { ...mocks[index], ...validated, updatedAt: new Date() };

    db.push(`/mocks[${index}]`, updatedMock);

    logger.info(`Updated mock: ${updatedMock.method} ${updatedMock.path}`);
    return res.json(updatedMock); // Añadido 'return'

  } catch (error) {
    return handleValidationError(res, error); // Añadido 'return'
  }
};

// Delete mock configuration
const deleteMock = (req, res) => {
  try {
    const { id } = req.params; // Aplicada desestructuración
    const mocks = db.getData('/mocks');
    const index = mocks.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json(formatError('Mock not found'));
    }

    const [deleted] = db.delete(`/mocks[${index}]`);
    logger.info(`Deleted mock: ${deleted.method} ${deleted.path}`);
    return res.status(204).send(); // Añadido 'return'

  } catch (error) {
    logger.error(`Delete failed: ${error.message}`);
    return res.status(500).json(formatError('Deletion error')); // Añadido 'return'
  }
};

module.exports = {
  createMock,
  getAllMocks,
  updateMock,
  deleteMock
};