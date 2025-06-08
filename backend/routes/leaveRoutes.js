const express = require('express');
const { applyForLeave, getAllLeavesForWarden, updateLeaveStatus } = require('../controllers/leaveController');
const { protect, studentOnly, wardenOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Student route
router.route('/apply').post(protect, studentOnly, applyForLeave);

// Warden routes
router.route('/warden').get(protect, wardenOnly, getAllLeavesForWarden);
router.route('/warden/:id/status').put(protect, wardenOnly, updateLeaveStatus);

module.exports = router;