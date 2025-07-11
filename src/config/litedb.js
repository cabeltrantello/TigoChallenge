const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');
const logger = require('../utils/logger.util');

const { dbPath } = require('./env');

const db = new JsonDB(new Config(dbPath, true, true, '/'));

try {
  const mocksData = db.getData('/mocks');
  if (!Array.isArray(mocksData)) {
    logger.warn('Mocks data at /mocks is not an array. Re-initializing.');
    db.push('/mocks', [], true);
  }
} catch (e) {
  if (e.message.includes("Can't find dataPath")) {
    logger.info("Initializing /mocks path in database as an empty array.");
    db.push('/mocks', [], true);
  } else {
    logger.error(`Error verifying /mocks path in database: ${e.message}`, e);
  }
}

try {
  const logsData = db.getData('/logs');
  if (!Array.isArray(logsData)) {
    logger.warn('Logs data at /logs is not an array. Re-initializing.');
    db.push('/logs', [], true);
  }
} catch (e) {
  if (e.message.includes("Can't find dataPath")) {
    logger.info("Initializing /logs path in database as an empty array.");
    db.push('/logs', [], true);
  } else {
    logger.error(`Error verifying /logs path in database: ${e.message}`, e);
  }
}

logger.info(`📊 Database file: ${dbPath}`); // Consistent logging

module.exports = db;