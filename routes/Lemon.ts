import express, { Request, Response } from "express";
const router = express.Router();
const fetch = require("node-fetch");
import { User } from "../models/User";
import { verify } from "../middlewares/Main";
require("dotenv").config();

const apikey =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiJhYTNlNjZjNjRjMGFmOGQyM2IyMTgyZTQxMmEzOWE2MTZjOTgyY2E4YzUyMzJmM2I1N2EzZDA4MWQxN2ZjZTMwZWFkNzJjNGQyM2I3ODU1OCIsImlhdCI6MTY4MDgyMjc0MS45Mjk5OCwibmJmIjoxNjgwODIyNzQxLjkyOTk4MiwiZXhwIjoxNzEyNDQ1MTQxLjkyMzgxNywic3ViIjoiMzU2MDg1Iiwic2NvcGVzIjpbXX0.x-pvt6u_Pkpgi5ETKPmzS7bELlUArt7FGJHCdbkjUbOKozdDjSZW3wQyov7Yis_kadlxUyzoPxQrojYTjMMMx8-R-PRGgH3WQp4CvUACcYp1fYLiUkZamMN0xYJCSsCBYHgtowymTu4Lw99_BSYwFIoNMYPCU91lIWP9_-wj0TvbMBcnVSUzz2GB8ER9aMhLlgs8L3nYc6-bVh_0eyK99Xqnlj6Pe3P0AYl0RXVMy-evlK4RxLTqRdGALWxctlEibmOFEhIBmKSdaGa2FvkXmv4ZR9g78DXmKJ0hjI7dpPo9js2C4JKQNRDfrhuHbgaqcTf01z4t3zQ7NZ7tZv-hedsWW6-DsajZ7bPtBvXy43021ux_MP2_dK2g05jhceQ75y9swU5DxTXaYIyw79l_lNp3LED-wTRcDD-ziuinfS2ENb35bFbd1_DIHVmjd5lqQ0Tkch22xtgwask50G3sNyE38duzSXquKXsxVUDS4-juDGYEuQZv3k411b5L3mI8";

router.get("/", verify, async (req: any, res: any) => {
  const id: any = req.token.id;
  const user = await User.findById(id);
  let data: any;

  const fetchdata = await fetch(
    "https://api.lemonsqueezy.com/v1/subscriptions/?page[number]=1&page[size]=100",
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
      await user.save();
    }
  }

  if (user.userLevel === "Abone") {
    res.redirect("/");
  } else {
    res.render("error/wrongemail");
  }
});

/* router.get("/getuserdata", verify, async (req: any, res: any) => {
  const id: any = req.token.id;
  const user = await User.findById(id);
  let data: any;

  const fetchdata = await fetch(
    "https://api.lemonsqueezy.com/v1/subscriptions/?page[number]=1&page[size]=100",
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

  console.log(data);
}); */

module.exports = router;
