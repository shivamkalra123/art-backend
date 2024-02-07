const express = require("express");
const { ensureAuthenticated } = require("../middleware/middleware");
const { addToCart, getCart } = require("../controllers/cartController");

const router = express.Router();

router.post("/cart/add", ensureAuthenticated, addToCart);
router.get("/cart", ensureAuthenticated, getCart);

module.exports = router;
