const express = require('express');
const { create, update } = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, create);
router.put('/:id', authMiddleware, isAdmin, update);

module.exports = router;
