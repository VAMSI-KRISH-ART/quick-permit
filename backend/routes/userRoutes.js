const express = require('express');
const { getStudentProfile } = require('../controllers/userController');
const { protect, studentOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/student/profile').get(protect, studentOnly, getStudentProfile);
// You can add a similar route for /warden/profile if needed

module.exports = router;