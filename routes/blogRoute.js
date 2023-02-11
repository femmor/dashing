const express = require('express');
const {
  create,
  update,
  getBlogs,
  getBlog,
} = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, create);
router.put('/:id', authMiddleware, isAdmin, update);

router.get('/', getBlogs);
router.get('/:id', getBlog);

module.exports = router;
