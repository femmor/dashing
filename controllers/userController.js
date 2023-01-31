const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create a new user
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
});

module.exports = {
  registerUser,
};
