const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// Mock configuration endpoints
router.post('/mocks', adminController.createMock);
router.get('/mocks', adminController.getAllMocks);
router.put('/mocks/:id', adminController.updateMock);
router.delete('/mocks/:id', adminController.deleteMock);

// Request logs endpoint
router.get('/logs', (req, res) => {
  try {
    const logs = db.getData('/logs');
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
});

module.exports = router;