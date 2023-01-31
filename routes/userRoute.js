const express = require('express');
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUser);

module.exports = router;
