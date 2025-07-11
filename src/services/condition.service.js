const logger = require('../utils/logger.util');

const matchConditions = (req, conditions = []) => { 
  if (!conditions.length) return true;

  try {
    return conditions.every(condition => {
      const { field, operator, value } = condition;
      const sourceObject = req[condition.source];
      const fieldValue = sourceObject && sourceObject[field];

      switch (operator) {
        case 'equals':
          return fieldValue === value;
        case 'notEquals':
          return fieldValue !== value;
        case 'includes':
          return fieldValue?.includes?.(value);
        case 'exists':
          return typeof fieldValue !== 'undefined';
        default:
          return false;
      }
    });
  } catch (err) {
    logger.error(`Condition matching failed: ${err.message}`);
    return false;
  }
};

module.exports = { matchConditions };
