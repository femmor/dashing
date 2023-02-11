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
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.status(200).json(blogs);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Get a blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateDbId(id);

    const blog = await Blog.findById(id);

    // increase the number of views
    await Blog.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

module.exports = {
  create,
  update,
  getBlogs,
  getBlog,
};
