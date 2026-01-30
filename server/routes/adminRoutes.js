const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getNotifications } = require('../controllers/adminController');

router.get('/notifications', protect, admin, getNotifications);

module.exports = router;
