const LeaveApplication = require('../models/leaveApplicationModel');
const User = require('../models/userModel');

// @desc    Apply for a new leave
// @route   POST /api/leaves/apply
// @access  Private/Student
const applyForLeave = async (req, res, next) => {
    try {
        const { leaveType, leaveDuration, startDate, startTime, endDate, endTime, reason, addressDuringLeave, guardianContact } = req.body;
        
        // Combine date and time from frontend
        const fromDate = new Date(`${startDate}T${startTime}`);
        const toDate = new Date(`${endDate}T${endTime}`);

        const application = new LeaveApplication({
            user: req.user._id,
            leaveType,
            leaveDuration,
            fromDate,
            toDate,
            reason,
            addressDuringLeave,
            guardianContact,
            // Add other optional fields if they exist in req.body
        });

        const createdApplication = await application.save();
        res.status(201).json({ message: 'Leave application submitted successfully!', data: createdApplication });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all leave applications for warden
// @route   GET /api/leaves/warden
// @access  Private/Warden
const getAllLeavesForWarden = async (req, res, next) => {
    try {
        const leaves = await LeaveApplication.find({}).populate('user', 'name registrationId hostelInfo').sort({ createdAt: -1 });

        // Format data to match warden dashboard expectations
        const formattedLeaves = leaves.map(leave => ({
            _id: leave._id,
            student_id: leave.user.registrationId,
            student_name: leave.user.name,
            room_no: leave.user.hostelInfo.roomNumber,
            leave_type: leave.leaveType,
            from_date: leave.fromDate,
            to_date: leave.toDate,
            status: leave.status
        }));

        res.json(formattedLeaves);
    } catch (error) {
        next(error);
    }
};

// @desc    Update leave status by warden
// @route   PUT /api/leaves/warden/:id/status
// @access  Private/Warden
const updateLeaveStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // Expecting 'Approved' or 'Rejected'
        if (!['Approved', 'Rejected'].includes(status)) {
            res.status(400);
            throw new Error('Invalid status value');
        }

        const leave = await LeaveApplication.findById(req.params.id);

        if (leave) {
            leave.status = status;
            const updatedLeave = await leave.save();
            res.json({ message: `Leave has been ${status.toLowerCase()}`, data: updatedLeave });
        } else {
            res.status(404);
            throw new Error('Leave application not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { applyForLeave, getAllLeavesForWarden, updateLeaveStatus };