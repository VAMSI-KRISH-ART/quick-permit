const User = require('../models/userModel');
const LeaveApplication = require('../models/leaveApplicationModel');

// @desc    Get student profile for dashboard
// @route   GET /api/users/student/profile
// @access  Private/Student
const getStudentProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Fetch leave stats for the dashboard
            const leavesTaken = await LeaveApplication.countDocuments({ user: req.user._id, status: 'Approved' });
            const totalLeavesAllowed = 25; // This could be in a config file

            res.json({
                name: user.name,
                profile_picture: user.profilePicture,
                hostel_info: {
                    room_no: user.hostelInfo.roomNumber,
                },
                academic_info: {
                    current_year: user.academicInfo.year,
                },
                leave_stats: {
                    leaves_taken: leavesTaken,
                    total_leaves_allowed: totalLeavesAllowed,
                    balance: totalLeavesAllowed - leavesTaken,
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { getStudentProfile };