import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { verify } from "../middlewares/Main";
import { authornot } from "../middlewares/AuthCheck";
import { marabacheck } from "../middlewares/MarabaCheck";
import { Kategori } from "../models/Kategori";
import { Urun } from "../models/Urun";
import { Masa } from "../models/Masa";
import { stringToSlug } from "../helpers/slug";
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");
const multer = require("multer");
const path = require("path");
const SharpMulter = require("sharp-multer");
const fs = require("fs");
let date = new Date().toLocaleDateString("tr-TR");

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

router.get("/dashboard", marabacheck, async (req: any, res: Response) => {
  const id = req.token.id;

  try {
    const user = await User.findById(id).populate("userMenu");

    res.render("user/dashboard/index", {
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/menu/post", marabacheck, async (req: any, res: Response) => {
  const id = req.token.id;
  const user = await User.findById(id).populate("userMenu");

  res.render("user/dashboard/menuaddpages/menudashboardpost", {
    user: user,
  });
});

router.get("/:menu/orders", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = req.params.menu;

  const filter = user.userMenu.filter((item) => {
    return item === menuid;
  });

  if (filter) {
    const findmenu: any = await Menu.findOne({ Slug: menuid }).populate({
      path: "Masalar",
      populate: [
        {
          path: "Orders",
          populate: [{ path: "Urunler", populate: [{ path: "Urun" }] }],
        },
      ],
    });

    res.render("user/dashboard/orderpages/index", {
      menu: findmenu,
      user: user,
    });
  } else {
    res.render("error/401");
  }
});

router.get("/:menu/edit", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = req.params.menu;

  const filter = user.userMenu.filter((item) => {
    return item === menuid;
  });

  if (filter) {
    const findmenu = await Menu.findOne({ Slug: menuid });

    res.render("user/dashboard/menueditpages/menueditdashboardpost", {
      menu: findmenu,
      user: user,
    });
  } else {
    res.render("error/401");
  }
});

router.get("/:menu/edit2", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = req.params.menu;

  const filter = user.userMenu.filter((item) => {
    return item === menuid;
  });

  if (filter) {
    const findmenu = await Menu.findOne({ Slug: menuid }).populate({
      path: "Kategoriler",
      populate: [{ path: "Urunler" }],
    });

    res.render("user/dashboard/menueditpages/menueditkategori", {
      menu: findmenu,
      user: user,
    });
  } else {
    req.render("error/401");
  }
});

router.get("/:menu/urunedit", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const urunid = req.params.menu;

  const filter = user.userMenu.filter((item) => {
    return item === urunid;
  });

  if (filter) {
    const findmenu = await Urun.findById(urunid);
    const mycategory = await Kategori.findById(findmenu.Kategori._id);
    const mymenu = await Menu.findById(mycategory.Menu._id).populate(
      "Kategoriler"
    );

    res.render("user/dashboard/menueditpages/menuediturun", {
      menu: findmenu,
      menuSlug: mymenu,
      user: user,
    });
  } else {
    res.render("error/401");
  }
});

router.get(
  "/:menu/kategoriedit",
  marabacheck,
  async (req: any, res: Response) => {
    const id: any = req.token.id;
    const user = await User.findById(id).populate("userMenu");
    const urunid = req.params.menu;

    const filter = user.userMenu.filter((item) => {
      return item === urunid;
    });

    if (filter) {
      const findmenu = await Kategori.findById(urunid);
      const mymenu = await Menu.findById(findmenu.Menu._id);
      const Slug = mymenu.Slug;

      res.render("user/dashboard/menueditpages/menueditonepagekategori", {
        menu: findmenu,
        menuSlug: Slug,
        user: user,
      });
    } else {
      res.render("error/401");
    }
  }
);

router.get(
  "/:menu/kategoriekle",
  marabacheck,
  async (req: any, res: Response) => {
    const id: any = req.token.id;
    const user = await User.findById(id).populate("userMenu");
    const menuid = req.params.menu;

    const filter = user.userMenu.filter((item) => {
      return item === menuid;
    });

    if (filter) {
      const findmenu = await Menu.findById(menuid).populate("Kategoriler");

      console.log(findmenu);

      res.render("user/dashboard/menuaddpages/menukategoripost", {
        menuid: menuid,
        menu: findmenu,
        user: user,
      });
    } else {
      res.render("error/401");
    }
  }
);

router.get("/:menu/urunekle", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = req.params.menu;

  const filter = user.userMenu.filter((item) => {
    return item === menuid;
  });

  if (filter) {
    const findmenu = await Menu.findById(menuid).populate({
      path: "Kategoriler",
      populate: [{ path: "Urunler" }],
    });

    res.render("user/dashboard/menuaddpages/menuurunpost", {
      menu: findmenu,
      menuid: menuid,
      user: user,
    });
  } else {
    res.render("error/401");
  }
});

router.get("/menu/postmasa", marabacheck, async (req: any, res: Response) => {
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
  marabacheck,
  async (req: any, res: Response) => {
    const { name } = req.body;
    const id: any = req.token.id;
    const slug = stringToSlug(name);

    const filePath = "public/images";
    const splitname = req.file.filename.split(".")[0];
    const image = stringToSlug(splitname + " " + date) + ".webp";

    await fs.rename(
      `${filePath}/${req.file.filename}`,
      `${filePath}/${image}`,
      () => {
        console.log("success");
      }
    );

    const user = await User.findById(id);

    const newMenu = new Menu({
      Name: name,
      user: user,
      image: image,
      Slug: slug,
    });

    try {
      user.userMenu.push(newMenu);
      await user.save();
      await newMenu.save();
      const menuid = newMenu._id;
      res.redirect(`/user/${menuid}/kategoriekle`);
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/menu/post1",
  upload.single("image"),
  marabacheck,
  async (req: any, res: Response) => {
    const { name, idmenu } = req.body;
    const id: any = req.token.id;
    const filePath = "public/images";
    const splitname = req.file.filename.split(".")[0];
    const image = stringToSlug(splitname + " " + date) + ".webp";

    await fs.rename(
      `${filePath}/${req.file.filename}`,
      `${filePath}/${image}`,
      () => {
        console.log("success");
      }
    );

    const user = await User.findById(id).populate("userMenu");
    const menuid = idmenu;

    const filter = user.userMenu.filter((item) => {
      return item === menuid;
    });

    if (filter) {
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
        res.redirect(`/user/${menuid}/kategoriekle`);
      } catch (err) {
        console.log(err);
      }
    } else {
      res.render("error/401");
    }
  }
);

router.post(
  "/menu/post2",
  upload.single("image"),
  marabacheck,
  async (req: any, res: Response) => {
    const { name, price, kategori, menuid } = req.body;
    const id: any = req.token.id;
    const filePath = "public/images";
    const splitname = req.file.filename.split(".")[0];
    const image = stringToSlug(splitname + " " + date) + ".webp";

    await fs.rename(
      `${filePath}/${req.file.filename}`,
      `${filePath}/${image}`,
      () => {
        console.log("success");
      }
    );

    const user = await User.findById(id).populate("userMenu");
    const idmenu = menuid;

    const filter = user.userMenu.filter((item) => {
      return item === idmenu;
    });

    if (filter) {
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
        res.redirect(`/user/${menuid}/urunekle`);
      } catch (err) {
        console.log(err);
      }
    } else {
      res.render("error/401");
    }
  }
);

router.post("/menu/postmasa", marabacheck, async (req: any, res: Response) => {
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

router.post(
  "/menu/edit",
  upload.single("image"),
  marabacheck,
  async (req: any, res: any) => {
    const { name, id } = req.body;
    const userid: any = req.token.id;
    const user = await User.findById(userid).populate("userMenu");
    const filter = user.userMenu.filter((item) => {
      return item === id;
    });

    if (filter) {
      const menu = await Menu.findById(id);
      const slug = menu.Slug;
      const filePath = "public/images";

      if (req.file) {
        await fs.unlinkSync(`${filePath}/${menu.image}`);
        const splitname = req.file.filename.split(".")[0];
        const image = stringToSlug(splitname + " " + date) + ".webp";

        await fs.rename(
          `${filePath}/${req.file.filename}`,
          `${filePath}/${image}`,
          () => {
            console.log("success");
          }
        );

        const updatedData = {
          Name: name,
          image: image,
        };
        const options = { new: true };
        const result = await Menu.findByIdAndUpdate(id, updatedData, options);
        res.redirect(`/user/${slug}/edit`);
      } else {
        const updatedData = {
          Name: name,
        };
        const options = { new: true };
        const result = await Menu.findByIdAndUpdate(id, updatedData, options);
        res.redirect(`/user/${slug}/edit`);
      }
    } else {
      res.render("error/401");
    }
  }
);

router.post(
  "/menu/kategoriedit",
  upload.single("image"),
  marabacheck,
  async (req: any, res: any) => {
    const { name, id } = req.body;

    const menu = await Kategori.findById(id);
    const mymenu = await Menu.findById(menu.Menu._id);
    const userid: any = req.token.id;
    const user = await User.findById(userid).populate("userMenu");
    const filter = user.userMenu.filter((item) => {
      return item === mymenu._id;
    });
    const Slug = mymenu.Slug;
    const filePath = "public/images";

    if (filter) {
      if (req.file) {
        await fs.unlinkSync(`${filePath}/${menu.image}`);
        const splitname = req.file.filename.split(".")[0];
        const image = stringToSlug(splitname + " " + date) + ".webp";

        await fs.rename(
          `${filePath}/${req.file.filename}`,
          `${filePath}/${image}`,
          () => {
            console.log("success");
          }
        );

        const updatedData = {
          Name: name,
          image: image,
        };
        const options = { new: true };
        const result = await Kategori.findByIdAndUpdate(
          id,
          updatedData,
          options
        );
        res.redirect(`/user/${Slug}/edit2`);
      } else {
        const updatedData = {
          Name: name,
        };
        const options = { new: true };
        const result = await Kategori.findByIdAndUpdate(
          id,
          updatedData,
          options
        );
        res.redirect(`/user/${Slug}/edit2`);
      }
    } else {
      res.render("error/401");
    }
  }
);

router.post(
  "/menu/urunedit",
  upload.single("image"),
  marabacheck,
  async (req: any, res: any) => {
    const { name, id, price } = req.body;

    const menu = await Urun.findById(id);
    const mycategory = await Kategori.findById(menu.Kategori._id);
    const mymenu = await Menu.findById(mycategory.Menu._id);
    const userid: any = req.token.id;
    const user = await User.findById(userid).populate("userMenu");
    const filter = user.userMenu.filter((item) => {
      return item === mymenu._id;
    });
    const filePath = "public/images";

    if (filter) {
      if (req.file) {
        await fs.unlinkSync(`${filePath}/${menu.image}`);
        const splitname = req.file.filename.split(".")[0];
        const image = stringToSlug(splitname + " " + date) + ".webp";

        await fs.rename(
          `${filePath}/${req.file.filename}`,
          `${filePath}/${image}`,
          () => {
            console.log("success");
          }
        );

        const updatedData = {
          Name: name,
          image: image,
          Price: price,
        };
        const options = { new: true };
        const result = await Urun.findByIdAndUpdate(id, updatedData, options);
        res.redirect(`/user/${mymenu.Slug}/edit2`);
      } else {
        const updatedData = {
          Name: name,
          Price: price,
        };
        const options = { new: true };
        const result = await Urun.findByIdAndUpdate(id, updatedData, options);
        res.redirect(`/user/${mymenu.Slug}/edit2`);
      }
    } else {
      res.render("error/401");
    }
  }
);

router.post("/:id/menusil", marabacheck, async (req: any, res: any) => {
  const id = req.params.id;
  const category = await Menu.findById(id);
  const userid: any = req.token.id;
  const user = await User.findById(userid).populate("userMenu");
  const filter = user.userMenu.filter((item) => {
    return item === category._id;
  });

  if (filter) {
    const data = await Menu.findByIdAndDelete(id);
    try {
      res.redirect(`/user/dashboard`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.render("error/401");
  }
});

router.post("/:id/kategorisil", marabacheck, async (req: any, res: any) => {
  const id = req.params.id;
  const category = await Kategori.findById(id);
  const mymenu = await Menu.findById(category.Menu._id);
  const userid: any = req.token.id;
  const user = await User.findById(userid).populate("userMenu");
  const filter = user.userMenu.filter((item) => {
    return item === mymenu._id;
  });

  if (filter) {
    const data = await Kategori.findByIdAndDelete(id);
    try {
      res.redirect(`/user/${mymenu.Slug}/edit2`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.render("error/401");
  }
});

router.post("/:id/urunsil", marabacheck, async (req: any, res: any) => {
  const id = req.params.id;
  const menu = await Urun.findById(id);
  const mycategory = await Kategori.findById(menu.Kategori._id);
  const mymenu = await Menu.findById(mycategory.Menu._id);
  const userid: any = req.token.id;
  const user = await User.findById(userid).populate("userMenu");
  const filter = user.userMenu.filter((item) => {
    return item === mymenu._id;
  });

  if (filter) {
    try {
      const data = await Urun.findByIdAndDelete(id);
      res.redirect(`/user/${mymenu.Slug}/edit2`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.render("error/401");
  }
});

router.post("/:id/masasil", marabacheck, async (req: any, res: any) => {
  const id = req.params.id;
  const menu = await Masa.findById(id).populate("Menu");
  const userid: any = req.token.id;
  const user = await User.findById(userid).populate("userMenu");
  const filter = user.userMenu.filter((item) => {
    return item === menu.Menu._id;
  });

  if (filter) {
    try {
      const data = await Masa.findByIdAndDelete(id);
      res.redirect(`/user/menu/postmasa`);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    res.render("error/401");
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
        sameSite: "lax",
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
  const email: string = req.body.email;

  const newUser = new User({
    username: username,
    password: password,
    email: email,
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
