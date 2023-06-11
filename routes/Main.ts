import express, { Request, Response } from "express";
import { Menu } from "../models/Menu";
import { User } from "../models/User";
const UserController = require("./User");
const AdminContoller = require("./Admin");
const LemonController = require("./Lemon");
const { authornot } = require("../middlewares/AuthCheck");
const qr = require("qrcode");
const router = express.Router();
const translatte = require("translatte");

router.get("/", authornot, async (req: any, res: any) => {
  //console.log(req.get("Accept-Language"));
  //console.log(req.acceptsLanguages("en-US"));

  const user = req.token;

  if (user) {
    const userid = req.token.id;
    const username = await User.findById(userid);

    res.render("indexen", {
      user: username,
    });
  } else {
    res.render("indexen");
  }
});

router.get("/tr", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    const userid = req.token.id;
    const username = await User.findById(userid);

    res.render("indextr", {
      user: username,
    });
  } else {
    res.render("indextr");
  }
});

router.get("/fr", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    const userid = req.token.id;
    const username = await User.findById(userid);

    res.render("indexfr", {
      user: username,
    });
  } else {
    res.render("indexfr");
  }
});

router.get("/es", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    const userid = req.token.id;
    const username = await User.findById(userid);

    res.render("indexes", {
      user: username,
    });
  } else {
    res.render("indexes");
  }
});

/* router.get("/tr/templates", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    const userid = req.token.id;
    const username = await User.findById(userid);

    res.render("buytr", {
      user: username,
    });
  } else {
    res.render("buytr");
  }
}); */

router.get("/register", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (req.acceptsLanguages("tr-TR")) {
    res.redirect("/tr/register");
  } else if (req.acceptsLanguages("fr")) {
    res.redirect("/fr/register");
  } else if (req.acceptsLanguages("es")) {
    res.redirect("/es/register");
  } else {
    if (user) {
      res.redirect("/");
    } else {
      res.render("user/register", {
        message: req.flash("error"),
      });
    }
  }
});

router.get("/login", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (req.acceptsLanguages("tr-TR")) {
    res.redirect("/tr/login");
  } else if (req.acceptsLanguages("fr")) {
    res.redirect("/fr/login");
  } else if (req.acceptsLanguages("es")) {
    res.redirect("/es/login");
  } else {
    if (user) {
      res.redirect("/");
    } else {
      res.render("user/login", {
        message: req.flash("error"),
      });
    }
  }
});

router.get("/tr/register", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    res.redirect("/");
  } else {
    res.render("user/registertr", {
      message: req.flash("error"),
    });
  }
});

router.get("/fr/register", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    res.redirect("/");
  } else {
    res.render("user/registerfr", {
      message: req.flash("error"),
    });
  }
});

router.get("/es/register", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    res.redirect("/");
  } else {
    res.render("user/registeres", {
      message: req.flash("error"),
    });
  }
});

router.get("/tr/login", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    res.redirect("/");
  } else {
    res.render("user/logintr", {
      message: req.flash("error"),
    });
  }
});

router.get("/fr/login", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    res.redirect("/");
  } else {
    res.render("user/loginfr", {
      message: req.flash("error"),
    });
  }
});

router.get("/es/login", authornot, async (req: any, res: any) => {
  const user = req.token;

  if (user) {
    res.redirect("/");
  } else {
    res.render("user/logines", {
      message: req.flash("error"),
    });
  }
});

router.post("/translate/:menuid", async (req: any, res: any) => {
  const lang = req.body.lang;
  const main = req.body.main;
  const menuid = req.params.menuid;
  const menu = await Menu.findById(menuid);

  if (menu && main) {
    const menulang = menu.NativeLang;

    const translated = await translatte(main, { from: menulang, to: lang });

    res.json(translated.text);
  } else {
    if (menu.NativeLang === "tr") {
      res.json("Kategori Adı Gİrin !");
    } else {
      res.json("Please Write Category Title !");
    }
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
