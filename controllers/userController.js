const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');
const validateDbId = require('../utils/validateDbId');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
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

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
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

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error('No users found');
  }
});

// @desc    Get user by id
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateDbId(id);
  const user = await User.findById(id).select('-password');

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateDbId(id);

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({ message: 'User deleted successfully' });
});

// @desc    Put block user
// @route   PUT /api/users/block-user/:id
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateDbId(id);

  try {
    await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.status(200).json('User blocked successfully');
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// @desc    Put unblock user
// @route   PUT /api/users/unblock-user/:id
// @access  Private/Admin
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateDbId(id);

  try {
    await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.status(200).json('User unblocked successfully');
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  deleteUser,
  updateUser,
  blockUser,
  unblockUser,
};
