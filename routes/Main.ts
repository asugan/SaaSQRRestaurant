import express, { Request, Response } from "express";
import { Menu } from "../models/Menu";
import { User } from "../models/User";
const UserController = require("./User");
const AdminContoller = require("./Admin");
const LemonController = require("./Lemon");
const { authornot } = require("../middlewares/AuthCheck");
const qr = require("qrcode");
const router = express.Router();

router.get("/", authornot, async (req: any, res: any) => {
  //console.log(req.get("Accept-Language"));
  //console.log(req.acceptsLanguages("en-US"));

  const user = req.token;

  if (user) {
    const userid = req.token.id;
    const username = await User.findById(userid);

    res.render("index", {
      user: username,
    });
  } else {
    res.render("index");
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

      res.redirect("/user/createqr");
    } else {
      res.redirect("/user/createqr");
    }
  });
});

router.use("/user", UserController);
router.use("/lemon", LemonController);
router.use("/admin", AdminContoller);

module.exports = router;
