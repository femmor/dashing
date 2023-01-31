const express = require('express');
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.delete('/:id', deleteUser);

module.exports = router;
