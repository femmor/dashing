const express = require('express');
const { create } = require('../controllers/blogController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, isAdmin, create);

module.exports = router;
