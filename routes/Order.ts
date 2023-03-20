import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
import { authornot } from "../middlewares/AuthCheck";
import { Kategori } from "../models/Kategori";
import { Urun } from "../models/Urun";
import { Order } from "../models/Order";
const router = express.Router();

router.post("/", async (req: any, res: any) => {
  const urunler = req.body;
  const ids: any = [];

  console.log(urunler);

  await urunler.map((item: any) => {
    return ids.push(item.id);
  });

  const order = new Order({
    Masaid: 13,
  });

  try {
    for (let i = 0; i < ids.length; i++) {
      order.Urunler.push(ids[i]);
    }
    await order.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
