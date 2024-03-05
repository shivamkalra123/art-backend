const Cart = require("../model/cartModel");
const Product = require("../model/products");

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
            price: product.price || 0,
            image: product.image,
          },
        ],
        total: quantity * (product.price || 0),
      });
    } else {
      const existingItem = cart.items.find((item) =>
        item.productId.equals(productId)
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // Include the image property when adding a new item
        cart.items.push({
          productId,
          quantity,
          price: product.price || 0,
          image: product.image,
        });
      }

      cart.total = cart.items.reduce((acc, item) => {
        return acc + item.quantity * (item.price || 0);
      }, 0);
    }

    await cart.save();

    res
      .status(201)
      .json({ message: "Product added to cart successfully", cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ... (rest of the code)

// ... (rest of the code)

const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      model: "Product",
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Map the items to include the image property
    const cartItemsWithImage = cart.items.map((item) => ({
      _id: item._id,
      productId: {
        _id: item.productId._id,
        name: item.productId.name,
        description: item.productId.description,
        price: item.productId.price,
        image: item.productId.image,
      },
      quantity: item.quantity,
      price: item.price,
    }));

    // Create a new object with the updated items and total
    const updatedCart = {
      userId: cart.userId,
      items: cartItemsWithImage,
      total: cart.total,
    };

    res.status(200).json({ cart: updatedCart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addToCart, getCart };
