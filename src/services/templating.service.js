const Handlebars = require('handlebars');
const { v4: uuidv4 } = require('uuid');

// Register custom helpers
Handlebars.registerHelper('uuid', () => uuidv4());
Handlebars.registerHelper('timestamp', () => Date.now());
Handlebars.registerHelper('toJson', (obj) => JSON.stringify(obj));

// Render template with request context
const renderTemplate = (template, req) => {
  try {
    const context = createTemplateContext(req);
    
    if (typeof template === 'object') {
      return renderObjectTemplate(template, context);
    }
    
    return renderStringTemplate(template, context);
  } catch (error) {
    console.error(`Template rendering error: ${error.message}`);
    return { error: "Template rendering failed" };
  }
};

// Create context for template rendering
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

// Render object templates recursively
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

// Render string template
const renderStringTemplate = (template, context) => {
  const compiled = Handlebars.compile(template);
  return compiled(context);
};

module.exports = { renderTemplate };