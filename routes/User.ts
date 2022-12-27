import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
import { authornot } from "../middlewares/AuthCheck";
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();

const secret: string = process.env.SECRET;

router.get("/register", async (req: Request, res: Response) => {
  res.render("user/register");
});

router.get("/login", async (req: Request, res: Response) => {
  res.render("user/login");
});

router.get("/logout", async (req, res) => {
  const jwt = req.cookies.OursiteJWT;

  if (!jwt) {
    return res.json({ message: "Bro you are already not logged in..." });
  } else {
    const serialised = serialize("OursiteJWT", null, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: -1,
      path: "/",
    });

    res.setHeader("Set-Cookie", serialised);

    res.status(200).redirect("/");
  }
});

router.get("/dashboard", verify, async (req: any, res: Response) => {
  const id = req.token.id;

  try {
    const user = await User.findById(id).populate("userMenu");
    console.log(user.userMenu);

    res.render("user/dashboard/index", {
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/menu/post", async (req: Request, res: Response) => {
  res.render("user/menupost");
});

router.get("/menu/:name", async (req: Request, res: Response) => {
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

router.post("/menu/post", async (req: Request, res: Response) => {
  const { name, fiyat }: { name: string; fiyat: number } = req.body;
  const user = await User.findById("63a9cd96f445eb602de8c372");

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
    user.userMenu.push(newMenu);
    await user.save();
    await newMenu.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req: Request, res: Response) => {
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

router.post("/register", async (req: Request, res: Response) => {
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
