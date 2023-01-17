import express, { Request, Response } from "express";
const router = express.Router();
const Iyzipay = require("iyzipay");
/* const fetch = require("node-fetch"); */
require("dotenv").config();

/* const token = process.env.Lemon_Secret; */

const iyzipay = new Iyzipay({
  apiKey: "sandbox-TucwT5o4eGlwIClHOl7OyIShZby2zhCK",
  secretKey: "sandbox-9glKw414pdD0NX2Cuutx1bklnUlVNKpL",
  uri: "https://sandbox-api.iyzipay.com",
});

router.get("/pay", async (req, res) => {
  res.render("iyzico/pay");
});

router.post("/pay", async (req, res) => {
  let digits = parseInt(Math.random().toFixed(11).replace("0.", ""));

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "123456789",
    callbackUrl: "http://localhost:3000/iyzipay/iyzipaycallback",
    pricingPlanReferenceCode: "b1aa2fce-5cab-45ef-83dd-d33b4d9c01cb",
    subscriptionInitialStatus: Iyzipay.SUBSCRIPTION_INITIAL_STATUS.ACTIVE,
    customer: {
      name: "Cagatay",
      surname: "Eren",
      identityNumber: "26464487898",
      email: "cagatayeren18@hotmail.com",
      gsmNumber: "+905426430505",
      billingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        district: "altunizade",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
      shippingAddress: {
        contactName: "Jane Doe",
        city: "Istanbul",
        district: "altunizade",
        country: "Turkey",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        zipCode: "34742",
      },
    },
  };

  iyzipay.subscriptionCheckoutForm.initialize(
    request,
    function (err: any, result: any) {
      const popup =
        result.checkoutFormContent +
        '<div id="iyzipay-checkout-form" class="popup"></div>';

      console.log(result, err);

      res.render("iyzico/iyzipay", {
        popup: popup,
      });
    }
  );
});

router.post("/iyzipaycallback", async (req, res) => {
  const request = {
    checkoutFormToken: req.body.token,
  };

  iyzipay.subscriptionCheckoutForm.retrieve(
    request,
    function (err: any, result: any) {
      if (result.status === "success") {
        console.log(result);
        res.redirect("/iyzipay/success");
      } else {
        console.log(err);
        res.redirect("/iyzipay/failed");
      }
    }
  );
});

router.post("/getcustomer", async (req, res) => {
  const request = {
    subscriptionReferenceCode: "0e3108ca-4388-4e19-b755-46cda0870580",
  };

  iyzipay.subscription.retrieve(request, function (err: any, result: any) {
    console.log(err, result);
  });
});

router.get("/success", async (req, res) => {
  res.render("iyzico/success");
});

router.get("/failed", async (req, res) => {
  res.render("iyzico/failed");
});

/* router.get("/lemon", async (req, res) => {
  const getdata = await fetch("https://api.lemonsqueezy.com/v1/subscriptions", {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${token}`,
    },
  });
  const jsontodata = await getdata.json();
  console.log(jsontodata.data[0]);

  res.render("lemon/index");
});
 */
module.exports = router;
