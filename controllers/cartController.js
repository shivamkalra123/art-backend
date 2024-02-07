const Cart = require("../model/cartModel");

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Assuming you have userId attached after authentication

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If user doesn't have a cart, create a new one
      cart = new Cart({ userId, items: [{ productId, quantity }] });
      await cart.save();
    } else {
      // If user already has a cart, update it
      const existingItem = cart.items.find((item) =>
        item.productId.equals(productId)
      );

      if (existingItem) {
        // If the product is already in the cart, update the quantity
        existingItem.quantity += quantity;
      } else {
        // If the product is not in the cart, add a new item
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    res
      .status(201)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCart = async (req, res) => {
  const userId = req.user._id; // Assuming you have userId attached after authentication

  try {
    const cart = await Cart.findOne({ userId }).populate(
      "items.productId",
      "name price"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addToCart, getCart };
