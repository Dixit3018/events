const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// payment intent
const paymentIntent = async (req, res) => {

    const amountInPaise = Math.round(parseInt(req.body.amount) * 100);
    await stripe.paymentIntents.create(
      {
        description: "Event Managment Service",
        shipping: {
          name: req.body.name,
          address: {
            line1: "510 Townsend St",
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US",
          },
        },
        amount: amountInPaise,
        currency: "inr",
        payment_method_types: ["card"],
      },
      function (err, paymentIntent) {
        if (err) {
          return res.status(500).json(err.message);
        } else {
          return res.status(201).json(paymentIntent);
        }
      }
    );
  };

module.exports = {paymentIntent}
  