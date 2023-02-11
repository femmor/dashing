const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateDbId = require('../utils/validateDbId');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
const create = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.status(201).json({
      message: 'Blog post created successfully!',
      newBlog,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: 'Blog updated successfully!', updatedBlog });
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
});

module.exports = {
  create,
  update,
};
