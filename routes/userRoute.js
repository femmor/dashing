const express = require('express');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post('/register', registerUser);

module.exports = router;
