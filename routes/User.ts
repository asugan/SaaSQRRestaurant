import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
import { authornot } from "../middlewares/AuthCheck";
import { Kategori } from "../models/Kategori";
import { Urun } from "../models/Urun";
import { Masa } from "../models/Masa";
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");
const multer = require("multer");
const path = require("path");
const SharpMulter = require("sharp-multer");

require("dotenv").config();

const secret: string = process.env.SECRET;

const storage: any = SharpMulter({
  destination: (req: any, file: any, cb: any) => {
    cb(null, path.resolve("public/images"));
  },
  imageOptions: {
    fileFormat: "webp",
    quality: 80,
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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

router.get("/menu/post1", verify, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = user.userMenu[0]._id;
  const findmenu = await Menu.findById(menuid).populate("Kategoriler");

  console.log(findmenu);

  res.render("user/menupost1", {
    menu: findmenu,
  });
});

router.get("/menu/post2", verify, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = user.userMenu[0]._id;
  const findmenu = await Menu.findById(menuid).populate({
    path: "Kategoriler",
    populate: [{ path: "Urunler" }],
  });

  res.render("user/menupost2", {
    menu: findmenu,
  });
});

router.get("/menu/postmasa", verify, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate({
    path: "userMenu",
    populate: [{ path: "Masalar" }],
  });

  res.render("user/postmasa", {
    user: user,
  });
});

router.post(
  "/menu/post",
  upload.single("image"),
  verify,
  async (req: any, res: Response) => {
    const { name } = req.body;
    const id: any = req.token.id;
    const image = req.file.filename;

    const user = await User.findById(id);

    const newMenu = new Menu({
      Name: name,
      user: user,
      image: image,
    });

    try {
      user.userMenu.push(newMenu);
      await user.save();
      await newMenu.save();
      res.redirect("/user/menu/post");
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/menu/post1",
  upload.single("image"),
  verify,
  async (req: any, res: Response) => {
    const { name } = req.body;
    const id: any = req.token.id;
    const image = req.file.filename;

    const user = await User.findById(id).populate("userMenu");
    const menuid = user.userMenu[0]._id;
    const menu = await Menu.findById(menuid);

    const newKategori: any = new Kategori({
      Name: name,
      Menu: menu,
      image: image,
    });

    try {
      menu.Kategoriler.push(newKategori);
      await newKategori.save();
      await menu.save();
      res.redirect("/user/menu/post1");
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/menu/post2",
  upload.single("image"),
  verify,
  async (req: any, res: Response) => {
    const { name, price, kategori } = req.body;
    const image = req.file.filename;

    const category = await Kategori.findById(kategori);

    const newUrun: any = new Urun({
      Name: name,
      Price: price,
      Kategori: kategori,
      image: image,
    });

    try {
      await newUrun.save();
      category.Urunler.push(newUrun);
      await category.save();
      res.redirect("/user/menu/post2");
    } catch (err) {
      console.log(err);
    }
  }
);

router.post("/menu/postmasa", verify, async (req: any, res: Response) => {
  const { number, menu } = req.body;

  const findmenu = await Menu.findById(menu);

  const newMasa: any = new Masa({
    Number: number,
    Menu: menu,
  });

  try {
    await newMasa.save();
    findmenu.Masalar.push(newMasa);
    await findmenu.save();
    res.redirect("/user/menu/postmasa");
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
