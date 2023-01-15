import express, { Request, Response } from "express";
const router = express.Router();
const Iyzipay = require("iyzipay");

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
      identityNumber: digits,
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
  iyzipay.subscriptionCheckoutForm.retrieve(
    {
      locale: Iyzipay.LOCALE.TR,
      conversationId: "123456789",
      token: req.body.token,
    },
    function (err: any, result: any) {
      const hamham = async () => {
        try {
          console.log(result);
          res.redirect("/iyzipay/success");
        } catch (err) {
          console.log(err);
        }
      };

      if (result.paymentStatus === "SUCCESS") {
        hamham();
      } else {
        console.log(err);
        res.render("odeme/failed");
      }
    }
  );
});

router.get("/success", async (req, res) => {
  res.render("iyzico/success");
});

module.exports = router;
