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

  menu.viewCount++;
  await menu.save();

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

router.get("/lang/:lang", async (req: any, res: any) => {
  const menuid = req.vhost[0];
  let lang;

  const menu = await Menu.findOne({ Slug: menuid }).populate({
    path: "Kategoriler",
    populate: [{ path: "Urunler" }],
  });

  menu.viewCount++;
  await menu.save();

  if (menu) {
    if (
      req.params.lang === "tr" ||
      req.params.lang === "fr" ||
      req.params.lang === "ru" ||
      req.params.lang === "en"
    ) {
      lang = req.params.lang;
    } else {
      lang = menu.NativeLang;
    }

    const user = await User.findById(menu.user);
    try {
      if (menu.NativeLang !== lang && user.userLevel !== "Maraba") {
        res.render(`menuthemes/menuclassic/menu${lang}`, {
          menu: menu,
        });
      } else {
        res.redirect(`/`);
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.render("error/404");
  }
});

module.exports = router;
