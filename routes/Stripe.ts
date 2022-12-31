import express, { Request, Response } from "express";
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51MFHU9KyjhhoE3bYxO8ckwYaYHJvLFKyqefhqdobPWkBySYZBGFc1JARqnQ9N0t3W917o8qMmlYRHL212S8Zww8A00gRYpvcaO"
);

const YOUR_DOMAIN = "http://localhost:3000";

router.get("/success", async (req, res) => {
  var session_id = req.query.session_id;

  const hamham = await stripe.checkout.sessions.retrieve(session_id);

  console.log(hamham);

  res.render("stripe/success");
});

router.get("/cancel", async (req, res) => {
  res.render("stripe/cancel");
});

router.get("/createitem", async (req, res) => {
  res.render("stripe/create");
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
    success_url: `${YOUR_DOMAIN}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/stripe/cancel`,
  });

  res.redirect(303, session.url);
});

router.post("/create-portal-session", async (req, res) => {
  const sessionobj =
    "cs_test_a1Jkp64qluy7d5SqEVBBEYW1iiZrFZm9U6pzZA3yDRGXhSV7byTyp9wVPM";
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionobj);

  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});

module.exports = router;
