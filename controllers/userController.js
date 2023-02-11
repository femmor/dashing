const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwtToken');
const generateRefreshToken = require('../config/refreshToken');
const validateDbId = require('../utils/validateDbId');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../controllers/emailController');

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
    const refreshToken = await generateRefreshToken(user._id);
    const updateUserData = await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

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

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.refreshToken) {
    res.status(401);
    throw new Error('No refresh token found in cookies');
  }

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      res.status(403);
      throw new Error('Invalid refresh token');
    }

    const accessToken = generateToken(user._id);
    res.status(200).json({ accessToken });
  });
});

// @desc    Logout user
// @route   GET /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie.refreshToken) {
    res.status(401);
    throw new Error('No refresh token found in cookies');
  }
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204); // Forbidden
  }
  await User.findOneAndUpdate(refreshToken, {
    refreshToken: '',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // No content
});

// @desc    Update password
// @route   PUT /api/users/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateDbId(_id);

  const { password } = req.body;
  const user = await User.findById(_id);

  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res
      .status(200)
      .json({ message: 'Password updated successfully', updatedPassword });
  } else {
    res.status(401);
    throw new Error('Invalid password');
  }
});

// @desc    Generate forgot password token
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User with this email not found');
  }

  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetUrl = `Please follow this link to reset your password. This link is valid for 10 minutes only. <a href="http://localhost:5001/api/users/reset-password/${token}">Reset Password</a>`;

    const data = {
      to: email,
      text: 'Hi there',
      subject: 'Reset Password',
      html: resetUrl,
    };

    await sendEmail(data);
    res.status(200).json({ message: 'Email sent successfully', token });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc    Reset password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  // Hash the token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user with the hashed token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // Check if user exists and token is valid
  if (!user) {
    res.status(404);
    throw new Error('Invalid token, please request a new one');
  }

  // Check if token is expired
  const isTokenExpired = user.passwordResetExpires < Date.now();

  if (isTokenExpired) {
    res.status(401);
    throw new Error('Token expired, please request a new one');
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({ message: 'Password updated successfully', user });
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
  handleRefreshToken,
  logoutUser,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
};
