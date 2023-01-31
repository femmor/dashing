const User = require('../models/userModel');

const registerUser = async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({
      success: false,
      message: 'User already exists',
    });
  }

  // Create a new user
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
};

module.exports = {
  registerUser,
};
