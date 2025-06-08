const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['student', 'warden'],
    default: 'student',
  },
  // Unique ID for student/warden
  registrationId: { type: String, required: true, unique: true },
  // Additional details to populate the dashboard
  profilePicture: { type: String, default: 'default_profile.png' },
  hostelInfo: {
    hostelName: { type: String },
    roomNumber: { type: String },
  },
  academicInfo: {
    course: { type: String },
    year: { type: String },
  },
  guardianInfo: {
      name: { type: String },
      contact: { type: String },
  }
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;