// Evaluates mock conditions against the incoming request
const matchConditions = (conditions = [], req) => {
  // No conditions, always match
  if (!conditions.length) return true;

  try {
    return conditions.every(condition => {
      const { field, operator, value } = condition;
      const fieldValue = req[condition.source]?.[field];

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
    console.error(`Condition matching failed: ${err.message}`);
    return false;
  }
};

module.exports = { matchConditions };
