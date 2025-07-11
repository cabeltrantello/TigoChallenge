const logger = require('./logger.util');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const formatError = (message, details = null) => ({
  error: {
    message,
    details,
    timestamp: new Date().toISOString()
  }
});

const errorHandler = (err, req, res) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500 ? 'Internal server error' : err.message;

  if (statusCode >= 500) {
    logger.error(err);
  }

  res.status(statusCode).json(formatError(message));
};

module.exports = {
  AppError,
  formatError,
  errorHandler
};