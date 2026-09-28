const Intern = require('../models/internModel');

const registerIntern = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      gender,
      address,
      email,
      phoneNumber,
      guardianNumber,
      cnicNumber,
      fatherName,
      course,
      teacherName,
      campus,
      obtainedMarks,
      aboutYou,
    } = req.body;

    // Basic validation for required fields
    if (
      !fullName ||
      !dateOfBirth ||
      !gender ||
      !address ||
      !email ||
      !phoneNumber ||
      !cnicNumber ||
      !fatherName ||
      !course ||
      !teacherName ||
      !campus ||
      !obtainedMarks ||
      !aboutYou
    ) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Check if an intern with the provided email or CNIC already exists
    const internExists = await Intern.findOne({
      $or: [{ email }, { cnicNumber }],
    });

    if (internExists) {
      return res.status(409).json({ message: 'Intern with this email or CNIC is already registered.' });
    }

    // Create a new intern in the database
    const intern = await Intern.create({
      fullName,
      dateOfBirth,
      gender,
      address,
      email,
      phoneNumber,
      guardianNumber,
      cnicNumber,
      fatherName,
      course,
      teacherName,
      campus,
      obtainedMarks,
      aboutYou,
    });

    // Return a 201 status code with the newly created intern data
    return res.status(201).json(intern);
  } catch (error) {
    console.error(`Error registering intern: ${error.message}`);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

module.exports = {
  registerIntern,
};
