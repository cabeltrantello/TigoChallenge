const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const logger = require('../utils/logger.util');

const { dbPath } = require('./env');

// Initialize LiteDB with automatic saving
const db = new JsonDB(new Config(dbPath, true, true, '/'));

// Seed initial data structure if empty
if (!db.exists('/mocks')) {
  db.push('/mocks', []);
  logger.info('Initialized mock database');
}

if (!db.exists('/logs')) {
  db.push('/logs', []);
  logger.info('Initialized request logs');
}

module.exports = db;