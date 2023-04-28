import express from "express";
import { Menu } from "../models/Menu";
import { User } from "../models/User";
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  const menuid = req.vhost[0];

  const menu = await Menu.findOne({ Slug: menuid }).populate({
    path: "Kategoriler",
    populate: [{ path: "Urunler" }],
  });

  if (menu) {
    const user = await User.findById(menu.user);
    if (user.userLevel !== "Maraba") {
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
  } else {
    res.render("error/404");
  }
});

router.get("/:lang", async (req: any, res: any) => {
  const menuid = req.vhost[0];
  const lang = req.params.lang;

  const menu = await Menu.findOne({ Slug: menuid }).populate({
    path: "Kategoriler",
    populate: [{ path: "Urunler" }],
  });

  if (menu) {
    const user = await User.findById(menu.user);
    try {
      if (menu.NativeLang !== lang && user.userLevel !== "Maraba") {
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

module.exports = router;
