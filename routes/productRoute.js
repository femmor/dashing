const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
} = require('../controllers/productController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

router.post('/', authMiddleware, isAdmin, createProduct);

module.exports = router;
