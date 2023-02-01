const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
};
