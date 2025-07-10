const express = require('express');
const router = express.Router();
const mockController = require('../controllers/mock.controller');

// Catch-all route for mock requests
router.all('*', mockController.handleMockRequest);

module.exports = router;