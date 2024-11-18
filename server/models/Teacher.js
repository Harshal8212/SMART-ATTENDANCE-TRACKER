const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model('Teacher', teacherSchema);