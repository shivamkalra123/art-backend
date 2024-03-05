const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product ID is required"],
  },
  quantity: {
    type: Number,
    default: 1,
    min: [0, "Quantity must be a non-negative number"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be a non-negative number"],
  },
  image: {
    type: String,
    // Make image optional
    required: false,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
