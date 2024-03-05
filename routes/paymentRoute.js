const express = require("express");
const paymentController = require("../controllers/paymentController");
const { ensureAuthenticated } = require("../middleware/middleware");

const router = express.Router();

// Define routes
router.post("/payments", ensureAuthenticated, paymentController.createPayment);
router.get(
  "/payments/:paymentId",
  ensureAuthenticated,
  paymentController.getPayment
);

module.exports = router;
