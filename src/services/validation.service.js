// src/services/validation.service.js
// eslint-disable-next-line no-unused-vars
const Joi = require('joi'); // Joi is used for type hinting and schema creation elsewhere, not directly in this function
const logger = require('../utils/logger.util');

/**
 * Valida los datos de entrada contra un esquema Joi.
 * @param {object} data - Los datos a validar.
 * @param {Joi.Schema} schema - El esquema Joi para la validación.
 * @returns {object} Los datos validados y saneados.
 * @throws {Error} Si la validación falla.
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