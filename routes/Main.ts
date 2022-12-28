import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
import { authornot } from "../middlewares/AuthCheck";
import { Kategori } from "../models/Kategori";
import { Urun } from "../models/Urun";
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

module.exports = router;
