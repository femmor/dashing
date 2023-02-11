const Post = require('../models/postModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateDbId = require('../utils/validateDbId');

// @desc    Create a new post
// @route   POST /api/Posts
// @access  Private
const create = asyncHandler(async (req, res) => {
  try {
    const newPost = await Post.create(req.body);
    res.status(201).json({
      message: 'Post post created successfully!',
      newPost,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
const update = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res
      .status(200)
      .json({ message: 'Post updated successfully!', updatedPost });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Get all Posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Get a post
// @route   GET /api/posts/:id
// @access  Public
const getPost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    validateDbId(id);

    const post = await Post.findById(id);

    // increase the number of views
    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    );

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      res.status(404);
      throw new Error('Post not found');
    }

    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

module.exports = {
  create,
  update,
  getPosts,
  getPost,
  deletePost,
};
