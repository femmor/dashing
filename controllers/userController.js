const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (user && (await user.isPasswordMatched(password))) {
    res.status(200).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error('No users found');
  }
});

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  deleteUser,
};
