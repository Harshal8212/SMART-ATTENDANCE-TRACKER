// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const Student = require('./models/Student');
const Teacher = require('./models/Teacher');
const OTP = require('./models/OTP');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;


mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/login', async (req, res) => {
  const { id, password } = req.body;

  // Check in students collection
  const student = await Student.findOne({ studentId: id, password });
  if (student) {
    return res.json({ type: 'student', name: student.name });
  }

  // Check in teachers collection
  const teacher = await Teacher.findOne({ teacherId: id, password });
  if (teacher) {
    return res.json({ type: 'teacher', name: teacher.name });
  }

  // If no match found
  res.status(401).json({ error: 'Invalid ID or password' });
});

// Generate OTP for a subject
app.post('/generate-otp', async (req, res) => {
    const { subject, teacherId } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Random 6-digit OTP
  
    const otpRecord = new OTP({ subject, teacherId, otp });
    await otpRecord.save();
  
    res.json({ otp });
  });
  
  // Verify OTP submitted by student
app.post('/verify-otp', async (req, res) => {
    const { studentId, otp } = req.body;

    const validOtp = await OTP.findOne({ otp });
    if (!validOtp) return res.status(400).json({ error: 'Invalid or expired OTP' });

    // Assuming student data would be fetched for attendance purposes
    const student = await Student.findOne({ studentId });
    if (!student) return res.status(400).json({ error: 'Student not found' });

    // Successful OTP verification, add to attendance (you may customize as needed)
    res.json({ success: true, student: { id: student.studentId, name: student.name }, subject: validOtp.subject });
});

app.listen(5000, () => {
  console.log('Server started on http://localhost:5000');
});
