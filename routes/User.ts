import express from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();

const secret: string = process.env.SECRET;

router.get("/register", async (req: any, res: any) => {
  res.render("user/register");
});

router.get("/index", verify, async (req: any, res: any) => {
  const id = req.token.id;

  res.render("user/userindex", {
    id: id,
  });
});

router.get("/login", async (req: any, res: any) => {
  res.render("user/login");
});

router.get("/menu/post", async (req: any, res: any) => {
  res.render("user/menupost");
});

router.get("/menu/:name", async (req: any, res: any) => {
  const menuid = req.params.name;

  const menu = await Menu.findById(menuid);

  try {
    res.render("user/menu", {
      menu: menu,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/menu/post", async (req: any, res: any) => {
  const { name, fiyat }: { name: string; fiyat: number } = req.body;
  const user = await User.findById("63a8852918828a103b4bd009");

  const newMenu = new Menu({
    İcecekler: [
      {
        name: name,
        fiyat: fiyat,
      },
    ],
    user: user,
  });

  try {
    await user.userMenu.push(newMenu);
    await user.save();
    await newMenu.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  const getuser = await User.findOne({ username: username });

  try {
    if (await bcrypt.compare(password, getuser.password)) {
      const token = sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
          id: getuser._id,
        },
        secret
      );

      const serialised = serialize("OursiteJWT", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      res.setHeader("Set-Cookie", serialised);

      res.status(200).redirect("/");
    } else {
      console.log("Kullanıcı Adı yada Şifre Yanlış");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req: any, res: any) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const newUser = new User({
    username: username,
    password: password,
    created_date: Date.now(),
  });

  try {
    await newUser.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
