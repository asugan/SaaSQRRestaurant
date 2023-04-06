import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
import { authornot } from "../middlewares/AuthCheck";
import { Kategori } from "../models/Kategori";
import { Urun } from "../models/Urun";
import { Order } from "../models/Order";
import { OrderUrun } from "../models/OrderUrun";
const router = express.Router();
const Iyzipay = require("iyzipay");

const iyzipay = new Iyzipay({
  apiKey: "sandbox-TucwT5o4eGlwIClHOl7OyIShZby2zhCK",
  secretKey: "sandbox-9glKw414pdD0NX2Cuutx1bklnUlVNKpL",
  uri: "https://sandbox-api.iyzipay.com",
});

router.post("/", async (req: any, res: any) => {
  const urunler = req.body;

  const order = new Order({
    Masaid: 13,
  });

  for (let i = 0; i < urunler.length; i++) {
    const hamham: any = new OrderUrun({
      Urun: urunler[i].id,
      Adet: urunler[i].adet,
      Order: order._id,
    });

    await hamham.save();
    order.Urunler.push(hamham);
  }

  try {
    await order.save();
  } catch (err) {
    console.log(err);
  }

  res.send(order._id);
});

router.get("/getorder/:orderid", async (req, res) => {
  const orderid = req.params.orderid;

  const order = await Order.findById(orderid).populate({
    path: "Urunler",
    populate: [{ path: "Urun" }],
  });

  // console.log(order.Urunler);

  res.render("order/index", {
    orderid: orderid,
    order: order,
  });
});

router.post("/iyzipay", async (req, res) => {
  const orderid = req.body.orderid;
  const mybasket: any = [];
  const prices: any = [];
  const adets: any = [];

  const order = await Order.findById(orderid).populate({
    path: "Urunler",
    populate: [{ path: "Urun" }],
  });

  const urunler: any = order.Urunler;

  urunler.map((item: any) => {
    return adets.push(item.Adet);
  });

  // console.log(adets);

  for (let i = 0; i < urunler.length; i++) {
    mybasket.push({
      id: urunler[i].Urun._id.valueOf(),
      name: urunler[i].Urun.Name,
      category1: "Collectibles",
      category2: "Accessories",
      itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
      price: Number(urunler[i].Urun.Price * adets[i]),
    });
  }

  // console.log(mybasket);

  mybasket.map((item: any) => {
    return prices.push(item.price);
  });

  // console.log(prices);

  let digits = parseInt(Math.random().toFixed(11).replace("0.", ""));

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: "123456789",
    price: "1",
    paidPrice: "1.2",
    currency: Iyzipay.CURRENCY.TRY,
    basketId: "B67832",
    paymentGroup: Iyzipay.PAYMENT_GROUP.LISTING,
    callbackUrl: "https://www.merchant.com/callback",
    enabledInstallments: [2, 3, 6, 9],
    buyer: {
      id: "BY789",
      name: "John",
      surname: "Doe",
      gsmNumber: "+905350000000",
      email: "email@email.com",
      identityNumber: digits,
      lastLoginDate: "2015-10-05 12:43:35",
      registrationDate: "2013-04-21 15:12:09",
      registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Turkey",
      zipCode: "34732",
    },
    shippingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    billingAddress: {
      contactName: "Jane Doe",
      city: "Istanbul",
      country: "Turkey",
      address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
      zipCode: "34742",
    },
    basketItems: mybasket,
  };

  function sumArray(array: any) {
    let sum: any = 0;

    array.forEach((item: any) => {
      sum += item;
    });

    return parseFloat(sum).toFixed(1).toString();
  }

  request.price = sumArray(prices);
  request.paidPrice = sumArray(prices);

  iyzipay.checkoutFormInitialize.create(
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

module.exports = router;
