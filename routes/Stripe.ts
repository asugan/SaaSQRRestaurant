import express, { Request, Response } from "express";
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51MFHU9KyjhhoE3bYxO8ckwYaYHJvLFKyqefhqdobPWkBySYZBGFc1JARqnQ9N0t3W917o8qMmlYRHL212S8Zww8A00gRYpvcaO"
);

const YOUR_DOMAIN = "http://localhost:3000";

router.get("/createitem", async (req, res) => {
  res.render("iyzicreate");
});

router.post("/create-checkout-session", async (req, res) => {
  const prices = await stripe.prices.list({
    product: "prod_N4y5KpJlcjyn22",
  });

  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    currency: "try",
    mode: "subscription",
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });

  console.log(session);

  res.redirect(303, session.url);
});

module.exports = router;
