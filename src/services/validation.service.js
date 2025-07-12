// src/services/validation.service.js
// eslint-disable-next-line no-unused-vars
const Joi = require('joi'); 
const logger = require('../utils/logger.util');

/**
 * 
 * @param {object} data 
 * @param {Joi.Schema} schema 
 * @returns {object} 
 * @throws {Error} 
 */
const validate = (data, schema) => {

  const { error, value } = schema.validate(data, { abortEarly: false, allowUnknown: true, stripUnknown: true });

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join('; ');
    logger.error(`Validation Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }

  return value;
};

module.exports = {
  validate,
};