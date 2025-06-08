const mongoose = require('mongoose');

const leaveApplicationSchema = mongoose.Schema({
  // Link to the student who applied
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  leaveType: { type: String, required: true },
  leaveDuration: { type: String, required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  addressDuringLeave: { type: String, required: true },
  guardianContact: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  // Optional fields
  travelMode: { type: String },
  travelDetails: { type: String },
  missedClasses: { type: String },
  assignmentStatus: { type: String },
}, { timestamps: true });

const LeaveApplication = mongoose.model('LeaveApplication', leaveApplicationSchema);
module.exports = LeaveApplication;