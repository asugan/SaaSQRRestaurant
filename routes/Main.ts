import express, { Request, Response } from "express";
import { Menu } from "../models/Menu";
const { authornot } = require("../middlewares/AuthCheck");
const qr = require("qrcode");
const router = express.Router();

router.get("/", authornot, async (req: any, res: any) => {
  //console.log(req.get("Accept-Language"));
  //console.log(req.acceptsLanguages("en-US"));

  const user = req.token;

  if (user) {
    res.render("index", {
      user: user,
    });
  } else {
    res.render("index");
  }
});

router.get("/menu/:name", async (req: Request, res: Response) => {
  const menuid = req.params.name;

  const menu = await Menu.findOne({ Slug: menuid }).populate({
    path: "Kategoriler",
    populate: [{ path: "Urunler" }],
  });

  if (menu) {
    try {
      res.render(`menuthemes/menuclassic/menu${menu.NativeLang}`, {
        menu: menu,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.render("error/404");
  }
});

router.get("/menu/:name/:lang", async (req: Request, res: Response) => {
  const menuid = req.params.name;
  const lang = req.params.lang;

  const menu = await Menu.findOne({ Slug: menuid }).populate({
    path: "Kategoriler",
    populate: [{ path: "Urunler" }],
  });

  if (menu) {
    try {
      if (menu.NativeLang !== lang) {
        res.render(`menuthemes/menuclassic/menu${lang}`, {
          menu: menu,
        });
      } else {
        res.redirect(`/menu/${menu.Slug}`);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.render("error/404");
  }
});

router.post("/scan", async (req, res) => {
  const { url, menu } = req.body;
  const opts = {
    errorCorrectionLevel: "H",
    type: "image/webp",
    quality: 1,
    width: 300,
    margin: 1,
    color: {
      dark: "#010599FF",
      light: "#FFBF60FF",
    },
  };

  if (url.length === 0) res.send("Empty Data!");

  qr.toDataURL(url, opts, async (err: any, src: any) => {
    if (err) res.send("Error occured");

    const findmenu = await Menu.findOne({ Slug: menu });

    if (findmenu) {
      findmenu.QRCode = src;
      await findmenu.save();

      res.redirect("/user/dashboard");
    } else {
      res.redirect("/user/dashboard");
    }
  });
});

module.exports = router;
