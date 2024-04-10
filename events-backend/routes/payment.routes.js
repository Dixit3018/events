const express = require('express');
const router = express.Router();

const stripeController = require("../controllers/stripe.controller");

// create stripe payment intent
router.post("/create-payment-intent", stripeController.paymentIntent);

module.exports = router;