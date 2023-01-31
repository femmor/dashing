const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token expired, Please login again');
    }
  } else {
    res.status(401);
    throw new Error('No token, authorization denied');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});

module.exports = { authMiddleware, isAdmin };
