const express = require('express');
const {
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
} = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logoutUser);

router.get('/', getUsers);
router.get('/:id', authMiddleware, isAdmin, getUser);

router.put('/update-password', authMiddleware, updatePassword);
router.put('/update-user', authMiddleware, isAdmin, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

router.delete('/:id', deleteUser);

module.exports = router;
