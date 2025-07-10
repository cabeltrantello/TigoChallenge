const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { rateLimit: rateLimitConfig } = require('./env');
const logger = require('../utils/logger.util');

module.exports = (app) => {
  // Enable CORS for all routes
  app.use(cors());
  
  // Rate limiting middleware
  app.use(rateLimit({
    windowMs: rateLimitConfig.windowMs,
    max: rateLimitConfig.max,
    standardHeaders: true,
    legacyHeaders: false
  }));
  
  // HTTP request logging
  app.use(morgan('combined', { 
    stream: { write: (message) => logger.info(message.trim()) } 
  }));
  
  // Body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  logger.info('Middleware initialized');
};