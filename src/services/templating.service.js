const Handlebars = require('handlebars');

const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger.util');

Handlebars.registerHelper('uuid', () => uuidv4());
Handlebars.registerHelper('timestamp', () => Date.now());
Handlebars.registerHelper('toJson', (obj) => JSON.stringify(obj));

const createTemplateContext = (req) => ({
  request: {
    path: req.path,
    method: req.method,
    query: req.query,
    body: req.body,
    headers: req.headers,
    params: req.params
  },
  faker: {
    uuid: uuidv4,
    timestamp: Date.now
  }
});

const renderStringTemplate = (template, context) => {
  const compiled = Handlebars.compile(template);
  return compiled(context);
};

const renderObjectTemplate = (obj, context) => {
  if (typeof obj === 'string') {
    return Handlebars.compile(obj)(context);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => renderObjectTemplate(item, context));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        renderObjectTemplate(value, context)
      ])
    );
  }

  return obj;
};

const renderTemplate = (template, req) => {
  try {
    const context = createTemplateContext(req);

    if (typeof template === 'object') {
      return renderObjectTemplate(template, context);
    }

    return renderStringTemplate(template, context);
  } catch (error) {
    logger.error(`Template rendering error: ${error.message}`);
    return { error: "Template rendering failed" };
  }
};

module.exports = { renderTemplate };