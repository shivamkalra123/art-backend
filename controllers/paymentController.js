// Require and configure dotenv
require("dotenv").config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Ensure the secret key is provided
if (!stripeSecretKey) {
  console.error(
    "Stripe secret key not provided. Make sure to set the STRIPE_SECRET_KEY environment variable."
  );
  process.exit(1); // Exit the application if the key is missing
}

const stripe = require("stripe")(stripeSecretKey);
const Payment = require("../model/payment");

class PaymentController {
  async createPayment(req, res) {
    try {
      const { amount, currency, description } = req.body;

      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        description,
      });

      // Save payment details in your database
      const payment = await Payment.create({
        amount,
        currency,
        description,
        stripePaymentId: paymentIntent.id,
      });

      res
        .status(201)
        .json({ payment, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getPayment(req, res) {
    try {
      const paymentId = req.params.paymentId;

      // Retrieve payment details from your database
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }

      res.status(200).json(payment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new PaymentController();
