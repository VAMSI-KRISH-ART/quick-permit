const express = require('express');
const { getAllNotices } = require('../controllers/noticeController.js');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();

// Any logged-in user can see notices
router.route('/').get(protect, getAllNotices);
// You could add a POST route for wardens to create notices

module.exports = router;