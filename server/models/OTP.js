// models/OTP.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  teacherId: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP expires in 5 minutes
});

module.exports = mongoose.model('OTP', otpSchema);
