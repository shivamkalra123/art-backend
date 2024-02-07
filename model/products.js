const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // You can store the image URL or file path as a string
    required: true,
    trim: true,
  },
  // Add more fields as needed for your product model
  // Example: brand, ratings, etc.
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
