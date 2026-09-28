const mongoose = require('mongoose');

const internSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    guardianNumber: {
      type: String,
    },
    cnicNumber: {
      type: String,
      required: true,
      unique: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    campus: {
      type: String,
      required: true,
    },
    obtainedMarks: {
      type: String,
      required: true,
    },
    aboutYou: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Intern = mongoose.model('Intern', internSchema);

module.exports = Intern;
