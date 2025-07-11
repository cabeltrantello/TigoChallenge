const winston = require('winston');

const { combine, printf } = winston.format;
const { env } = require('../config/env');

const logFormat = printf(({ level, message, timestamp }) =>
  `${timestamp} [${level.toUpperCase()}]: ${message}`
);

const logger = winston.createLogger({
  level: env === 'production' ? 'info' : 'debug',
  format: combine(
    winston.format.timestamp(),
    logFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, { stack: error.stack });
  process.exit(1);
});

module.exports = logger;