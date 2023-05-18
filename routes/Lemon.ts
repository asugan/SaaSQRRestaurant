import express, { Request, Response } from "express";
const router = express.Router();
const fetch = require("node-fetch");
import { User } from "../models/User";
import { verify } from "../middlewares/Main";
require("dotenv").config();

const apikey = process.env.Lemon_Secret;

router.get("/", verify, async (req: any, res: any) => {
  const id: any = req.token.id;
  const user = await User.findById(id);
  let data: any;

  const fetchdata = await fetch(
    "https://api.lemonsqueezy.com/v1/subscriptions",
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
    }
  )
    .then((response: any) => response.json())
    .then((body: any) => {
      data = body.data;
    });

  for (let i = 0; i < data.length; i++) {
    if (
      user.email === data[i].attributes.user_email &&
      data[i].attributes.status === "active"
    ) {
      user.userLevel = "Abone";
      user.daysLeft = data[i].attributes.renews_at;
      user.lemonid = data[i].id;
      await user.save();
    }
  }

  if (user.userLevel === "Abone") {
    res.redirect("/");
  } else {
    res.render("error/wrongemail");
  }
});

router.get("/unsubscribe", verify, async (req: any, res: any) => {
  const id: any = req.token.id;
  const user = await User.findById(id);

  const fetchdata = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions/${user.lemonid}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
    }
  );

  res.redirect("/");
});

/* router.get("/takeinfo", verify, async (req: any, res: any) => {
  const id: any = req.token.id;
  const user = await User.findById(id);

  const fetchdata = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions/${user.lemonid}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apikey}`,
      },
    }
  );

  const jsondata = await fetchdata.json();

  res.json(jsondata.data.attributes.status);
}); */

module.exports = router;
