const { v4: uuidv4 } = require('uuid');

const db = require('../config/litedb');
const { mockSchema, updateSchema } = require('../models/mock.model');

const { validate } = require('../services/validation.service');
const logger = require('../utils/logger.util');
const { formatError } = require('../utils/error.util');

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
    const validatedMockData = await validate(req.body, mockSchema);

    const newMock = {
      id: uuidv4(),
      active: validatedMockData.active !== undefined ? validatedMockData.active : true,
      ...validatedMockData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.push('/mocks[]', newMock, true);
    logger.info(`Created mock: ${newMock.method} ${newMock.path}`);
    return res.status(201).json(newMock);
  } catch (error) {
    return handleValidationError(res, error);
  }
};

// Get all mock configurations
const getAllMocks = async (req, res) => {
  try {
    const mocks = await db.getData('/mocks');
    return res.json(mocks);
  } catch (error) {
    logger.error(`Failed to retrieve mocks: ${error.message}`);
    return res.status(500).json(formatError('Database error'));
  }
};

// Update mock configuration
const updateMock = async (req, res) => {
  try {
    const { id } = req.params;
    const mocksRaw = await db.getData('/mocks');

    let mocks;
    if (Array.isArray(mocksRaw)) {
      mocks = mocksRaw;
    } else if (typeof mocksRaw === 'object' && mocksRaw !== null) {
      mocks = Object.values(mocksRaw);
    } else {
      mocks = [];
      await db.push('/mocks', [], true);
    }

    const index = mocks.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json(formatError('Mock not found'));
    }

    const validated = await validate(req.body, updateSchema);
    const updatedMock = { ...mocks[index], ...validated, updatedAt: new Date().toISOString() };

    await db.push(`/mocks[${index}]`, updatedMock, true);

    logger.info(`Updated mock: ${updatedMock.method} ${updatedMock.path}`);
    return res.json(updatedMock);

  } catch (error) {
    return handleValidationError(res, error);
  }
};

// Delete mock configuration
const deleteMock = async (req, res) => {
  try {
    const { id } = req.params;
    const mocksRaw = await db.getData('/mocks');

    let mocks;
    if (Array.isArray(mocksRaw)) {
      mocks = mocksRaw;
    } else if (typeof mocksRaw === 'object' && mocksRaw !== null) {
      mocks = Object.values(mocksRaw);
    } else {
      mocks = [];
      await db.push('/mocks', [], true);
    }

    const index = mocks.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json(formatError('Mock not found'));
    }

    const deletedMock = mocks[index];

    await db.delete(`/mocks[${index}]`);

    logger.info(`Deleted mock: ${deletedMock.method} ${deletedMock.path}`);
    return res.status(204).send(); // No Content

  } catch (error) {
    logger.error(`Delete failed: ${error.message}`);
    return res.status(500).json(formatError('Deletion error'));
  }
};


module.exports = {
  createMock,
  getAllMocks,
  updateMock,
  deleteMock
};
