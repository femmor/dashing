const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      enum: ['Apple', 'Samsung', 'Lenovo'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    quantity: {
      type: Number,
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      enum: ['Black', 'Brown', 'Red'],
    },
    ratings: {
      type: Number,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
