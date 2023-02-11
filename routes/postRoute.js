const express = require('express');
const {
  create,
  update,
  getPosts,
  getPost,
  deletePost,
} = require('../controllers/postController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, create);
router.put('/:id', authMiddleware, isAdmin, update);

router.get('/', getPosts);
router.get('/:id', getPost);

router.delete('/:id', authMiddleware, isAdmin, deletePost);

module.exports = router;
