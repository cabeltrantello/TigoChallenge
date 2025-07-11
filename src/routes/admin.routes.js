const express = require('express');

const router = express.Router();
const adminController = require('../controllers/admin.controller');
const db = require('../config/litedb');
const logger = require('../utils/logger.util');

router.post('/mocks', adminController.createMock);
router.get('/mocks', adminController.getAllMocks);
router.put('/mocks/:id', adminController.updateMock);
router.delete('/mocks/:id', adminController.deleteMock);

router.get('/logs', (req, res) => {
  try {
    const logs = db.getData('/logs') || [];
    res.json(logs);
  } catch (error) {
    logger.error('Failed to retrieve logs:', error);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

module.exports = router;