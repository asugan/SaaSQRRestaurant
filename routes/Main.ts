import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
import { authornot } from "../middlewares/AuthCheck";
import { Kategori } from "../models/Kategori";
import { Urun } from "../models/Urun";
const qr = require("qrcode");
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  res.render("index");
});

router.get("/menu/:name", async (req: Request, res: Response) => {
  const menuid = req.params.name;

  const menu = await Menu.findOne({ Name: menuid }).populate({
    path: "Kategoriler",
    populate: [{ path: "Urunler" }],
  });

  console.log(menu);

  try {
    res.render("user/menu", {
      menu: menu,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/scan", async (req, res) => {
  const { url, menu } = req.body;

  if (url.length === 0) res.send("Empty Data!");

  qr.toDataURL(url, async (err: any, src: any) => {
    if (err) res.send("Error occured");

    const findmenu = await Menu.findById(menu);

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
