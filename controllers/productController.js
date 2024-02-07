const mongoose = require("mongoose");
const Product = require("../model/products");

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // Check if req.file exists before accessing its properties
    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({
      name,
      description,
      price,
      category,
      image,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const showProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json("Something Unexpected Happened");
    console.log(e);
  }
};

const showProductByID = async (req, res) => {
  try {
    const productId = req.params.productId; // Use req.params.productId to get the product ID from the URL

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await Product.findById(productId);

    if (!result) return res.status(404).json({ error: "Product not found" });

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json("Something went wrong");
  }
};

module.exports = {
  createProduct,
  showProduct,
  showProductByID,
};
