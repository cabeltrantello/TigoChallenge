const express = require('express');
const adminRoutes = require('./admin.routes');
const mockRoutes = require('./mock.routes');

const router = express.Router();

// API documentation route
router.get('/docs', (req, res) => {
  res.redirect('/docs/api.html');
});

// Admin management routes
router.use('/admin', adminRoutes);

// Mock endpoints (lowest priority)
router.use(mockRoutes);

module.exports = router;