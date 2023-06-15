import express, { Request, Response } from "express";
import { User } from "../models/User";
import { Menu } from "../models/Menu";
import { marabacheck } from "../middlewares/MarabaCheck";
import { Kategori } from "../models/Kategori";
import { Urun } from "../models/Urun";
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
const jwt = require("jsonwebtoken");
import { sendMail } from "../middlewares/tokenSender";
import { authornot } from "../middlewares/AuthCheck";
const { menuValidate } = require("../helpers/uservalidate");
const { categoryValidate } = require("../helpers/uservalidate");
const { urunValidate } = require("../helpers/uservalidate");
const { userLoginValidate } = require("../helpers/uservalidate");
const { userSignupValidate } = require("../helpers/uservalidate");

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

router.get("/logout", async (req, res) => {
  const jwt = req.cookies.OursiteJWT;

  if (!jwt) {
    return res.redirect("/");
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

    if (req.acceptsLanguages("tr-TR")) {
      res.render("user/dashboard/index", {
        user: user,
      });
    } else {
      res.render("user/dashboard/dashboarden/index", {
        user: user,
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/unsubscribe", marabacheck, async (req: any, res: any) => {
  const id = req.token.id;
  const user = await User.findById(id).populate("userMenu");

  if (req.acceptsLanguages("tr-TR")) {
    res.render("user/dashboard/unsubscribe", {
      user: user,
    });
  } else {
    res.render("user/dashboard/dashboarden/unsubscribe", {
      user: user,
    });
  }
});

router.get("/createqr", marabacheck, async (req: any, res: any) => {
  const id = req.token.id;
  const user = await User.findById(id).populate("userMenu");

  if (req.acceptsLanguages("tr-TR")) {
    res.render("user/dashboard/createqr", {
      user: user,
    });
  } else {
    res.render("user/dashboard/dashboarden/createqr", {
      user: user,
    });
  }
});

router.get("/menu/post", marabacheck, async (req: any, res: Response) => {
  const id = req.token.id;
  const user = await User.findById(id).populate("userMenu");

  if (user.menuLeft > 0) {
    if (req.acceptsLanguages("tr-TR")) {
      res.render("user/dashboard/menuaddpages/menudashboardpost", {
        user: user,
      });
    } else {
      res.render("user/dashboard/dashboarden/menuaddpages/menudashboardpost", {
        user: user,
      });
    }
  } else {
    res.render("error/nomenuleft");
  }
});

router.get("/:menu/edit", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = req.params.menu;

  const filter = user.userMenu.filter((item: any) => {
    return item.Slug === menuid;
  });

  if (filter.length) {
    const findmenu = await Menu.findOne({ Slug: menuid });

    if (req.acceptsLanguages("tr-TR")) {
      res.render("user/dashboard/menueditpages/menueditdashboardpost", {
        menu: findmenu,
        user: user,
      });
    } else {
      res.render(
        "user/dashboard/dashboarden/menueditpages/menueditdashboardpost",
        {
          menu: findmenu,
          user: user,
        }
      );
    }
  } else {
    res.render("error/401");
  }
});

router.get("/:menu/edit2", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = req.params.menu;

  const filter = user.userMenu.filter((item: any) => {
    return item.Slug === menuid;
  });

  if (filter.length) {
    const findmenu = await Menu.findOne({ Slug: menuid }).populate({
      path: "Kategoriler",
      populate: [{ path: "Urunler" }],
    });

    if (req.acceptsLanguages("tr-TR")) {
      res.render("user/dashboard/menueditpages/menueditkategori", {
        menu: findmenu,
        user: user,
      });
    } else {
      res.render("user/dashboard/dashboarden/menueditpages/menueditkategori", {
        menu: findmenu,
        user: user,
      });
    }
  } else {
    req.render("error/401");
  }
});

router.get("/:menu/urunedit", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const urunid = req.params.menu;
  const findmenu = await Urun.findById(urunid);
  const mycategory = await Kategori.findById(findmenu.Kategori._id);
  const mymenu = await Menu.findById(mycategory.Menu._id).populate(
    "Kategoriler"
  );

  const filter = user.userMenu.filter((item: any) => {
    return item.Slug === mymenu.Slug;
  });

  if (filter.length) {
    if (req.acceptsLanguages("tr-TR")) {
      res.render("user/dashboard/menueditpages/menuediturun", {
        menu: findmenu,
        menuSlug: mymenu,
        user: user,
      });
    } else {
      res.render("user/dashboard/dashboarden/menueditpages/menuediturun", {
        menu: findmenu,
        menuSlug: mymenu,
        user: user,
      });
    }
  } else {
    res.render("error/404");
  }
});

router.get(
  "/:menu/kategoriedit",
  marabacheck,
  async (req: any, res: Response) => {
    const id: any = req.token.id;
    const user = await User.findById(id).populate("userMenu");
    const urunid = req.params.menu;
    const findmenu = await Kategori.findById(urunid);
    const mymenu = await Menu.findById(findmenu.Menu._id);

    const filter = user.userMenu.filter((item: any) => {
      return item.Slug === mymenu.Slug;
    });

    if (filter.length) {
      if (req.acceptsLanguages("tr-TR")) {
        res.render("user/dashboard/menueditpages/menueditonepagekategori", {
          menu: findmenu,
          mymenu: mymenu,
          user: user,
        });
      } else {
        res.render(
          "user/dashboard/dashboarden/menueditpages/menueditonepagekategori",
          {
            menu: findmenu,
            mymenu: mymenu,
            user: user,
          }
        );
      }
    } else {
      res.render("error/404");
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

    const filter = user.userMenu.filter((item: any) => {
      return item.Slug === menuid;
    });

    if (filter.length) {
      const findmenu = await Menu.findOne({ Slug: menuid }).populate(
        "Kategoriler"
      );

      if (req.acceptsLanguages("tr-TR")) {
        res.render("user/dashboard/menuaddpages/menukategoripost", {
          menu: findmenu,
          user: user,
          nativelang: "name" + findmenu.NativeLang,
        });
      } else {
        res.render("user/dashboard/dashboarden/menuaddpages/menukategoripost", {
          menu: findmenu,
          user: user,
          nativelang: "name" + findmenu.NativeLang,
        });
      }
    } else {
      res.render("error/404");
    }
  }
);

router.get("/:menu/urunekle", marabacheck, async (req: any, res: Response) => {
  const id: any = req.token.id;
  const user = await User.findById(id).populate("userMenu");
  const menuid = req.params.menu;

  const filter = user.userMenu.filter((item: any) => {
    return item.Slug === menuid;
  });

  if (filter.length) {
    const findmenu = await Menu.findOne({ Slug: menuid }).populate({
      path: "Kategoriler",
      populate: [{ path: "Urunler" }],
    });

    if (req.acceptsLanguages("tr-TR")) {
      res.render("user/dashboard/menuaddpages/menuurunpost", {
        menu: findmenu,
        user: user,
        nativename: "name" + findmenu.NativeLang,
        nativedesc: "description" + findmenu.NativeLang,
      });
    } else {
      res.render("user/dashboard/dashboarden/menuaddpages/menuurunpost", {
        menu: findmenu,
        user: user,
        nativename: "name" + findmenu.NativeLang,
        nativedesc: "description" + findmenu.NativeLang,
      });
    }
  } else {
    res.render("error/401");
  }
});

router.post(
  "/menu/post",
  upload.single("image"),
  marabacheck,
  async (req: any, res: Response) => {
    const { error, value } = menuValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      try {
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    } else {
      const {
        name,
        lang,
        currency,
        instagram,
        facebook,
        twitter,
        whatsapp,
        menuid,
        adres,
      } = req.body;
      const id: any = req.token.id;
      const slug = stringToSlug(name);
      const filePath = "public/images";
      const user = await User.findById(id);

      if (req.file && user.menuLeft > 0) {
        const splitname = req.file.filename.split(".")[0];
        const image = stringToSlug(splitname + " " + date) + ".webp";

        await fs.rename(
          `${filePath}/${req.file.filename}`,
          `${filePath}/${image}`,
          () => {
            console.log("success");
          }
        );

        const newMenu = new Menu({
          Name: name,
          user: user,
          image: image,
          Slug: slug,
          NativeLang: lang,
          Currency: currency,
          Instagram: instagram,
          Facebook: facebook,
          Twitter: twitter,
          Whatsapp: whatsapp,
          MenuID: menuid,
          Adres: adres,
        });

        try {
          user.userMenu.push(newMenu);
          user.menuLeft -= 1;
          await user.save();
          await newMenu.save();
          const menuid = newMenu.Slug;
          res.redirect(`/user/${menuid}/kategoriekle`);
        } catch (err) {
          console.log(err);
        }
      } else {
        res.render("user/dashboard/menuaddpages/menudashboardpost", {
          error: "Logo Yüklemek Zorundasınız !",
        });
      }
    }
  }
);

router.post(
  "/menu/post1",
  upload.single("image"),
  marabacheck,
  async (req: any, res: Response) => {
    const { error, value } = categoryValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      try {
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    } else {
      let { idmenu, nameen, nameru, namefr, nametr } = req.body;

      const id: any = req.token.id;
      const filePath = "public/images";
      const user = await User.findById(id).populate("userMenu");
      const menuid = idmenu;
      const filter = user.userMenu.filter((item) => {
        return item.id === menuid;
      });

      if (req.file) {
        const splitname = req.file.filename.split(".")[0];
        const image = stringToSlug(splitname + " " + date) + ".webp";

        await fs.rename(
          `${filePath}/${req.file.filename}`,
          `${filePath}/${image}`,
          () => {
            console.log("success");
          }
        );

        if (filter.length) {
          const menu = await Menu.findById(menuid);

          const newKategori: any = new Kategori({
            Nametr: nametr,
            Menu: menu,
            image: image,
            Nameen: nameen,
            Namefr: namefr,
            Nameru: nameru,
          });

          try {
            menu.Kategoriler.push(newKategori);
            await newKategori.save();
            await menu.save();
            res.redirect(`/user/${menu.Slug}/kategoriekle`);
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        if (filter.length) {
          const menu = await Menu.findById(menuid);

          const newKategori: any = new Kategori({
            Nametr: nametr,
            Menu: menu,
            Nameen: nameen,
            Namefr: namefr,
            Nameru: nameru,
          });

          try {
            menu.Kategoriler.push(newKategori);
            await newKategori.save();
            await menu.save();
            res.redirect(`/user/${menu.Slug}/kategoriekle`);
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }
);

router.post(
  "/menu/post2",
  upload.single("image"),
  marabacheck,
  async (req: any, res: Response) => {
    const { error, value } = urunValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      try {
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    } else {
      let {
        price,
        kategori,
        menuid,
        nametr,
        nameen,
        nameru,
        namefr,
        currency,
        descriptionen,
        descriptionru,
        descriptionfr,
        descriptiontr,
      } = req.body;

      const id: any = req.token.id;
      const filePath = "public/images";
      const user = await User.findById(id).populate("userMenu");
      const mainmenu = await Menu.findById(menuid);

      const filter = user.userMenu.filter((item: any) => {
        return item.Slug === mainmenu.Slug;
      });

      if (req.file) {
        const splitname = req.file.filename.split(".")[0];
        const image = stringToSlug(splitname + " " + date) + ".webp";

        await fs.rename(
          `${filePath}/${req.file.filename}`,
          `${filePath}/${image}`,
          () => {
            console.log("success");
          }
        );

        if (filter.length) {
          const category = await Kategori.findById(kategori);

          const newUrun: any = new Urun({
            Nametr: nametr,
            Currency: currency,
            Nameen: nameen,
            Namefr: namefr,
            Nameru: nameru,
            Price: price,
            Kategori: kategori,
            image: image,
            Descriptiontr: descriptiontr,
            Descriptionen: descriptionen,
            Descriptionfr: descriptionfr,
            Descriptionru: descriptionru,
          });

          try {
            await newUrun.save();
            category.Urunler.push(newUrun);
            await category.save();
            res.redirect(`/user/${mainmenu.Slug}/urunekle`);
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        if (filter.length) {
          const category = await Kategori.findById(kategori);

          const newUrun: any = new Urun({
            Nametr: nametr,
            Currency: currency,
            Nameen: nameen,
            Namefr: namefr,
            Nameru: nameru,
            Price: price,
            Kategori: kategori,
            Descriptiontr: descriptiontr,
            Descriptionen: descriptionen,
            Descriptionfr: descriptionfr,
            Descriptionru: descriptionru,
          });

          try {
            await newUrun.save();
            category.Urunler.push(newUrun);
            await category.save();
            res.redirect(`/user/${mainmenu.Slug}/urunekle`);
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }
);

router.post(
  "/menu/edit",
  upload.single("image"),
  marabacheck,
  async (req: any, res: any) => {
    const { error, value } = menuValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      try {
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    } else {
      const {
        name,
        id,
        lang,
        currency,
        instagram,
        facebook,
        whatsapp,
        twitter,
        menuid,
        adres,
      } = req.body;
      const userid: any = req.token.id;
      const user = await User.findById(userid).populate("userMenu");
      const filter = user.userMenu.filter((item) => {
        return item.id === id;
      });

      if (filter.length) {
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
            NativeLang: lang,
            image: image,
            Currency: currency,
            Instagram: instagram,
            Facebook: facebook,
            Twitter: twitter,
            Whatsapp: whatsapp,
            MenuID: menuid,
            Adres: adres,
          };
          const options = { new: true };
          const result = await Menu.findByIdAndUpdate(id, updatedData, options);
          res.redirect(`/user/${slug}/edit`);
        } else {
          const updatedData = {
            Name: name,
            NativeLang: lang,
            Currency: currency,
            Instagram: instagram,
            Facebook: facebook,
            Twitter: twitter,
            Whatsapp: whatsapp,
            MenuID: menuid,
            Adres: adres,
          };
          const options = { new: true };
          const result = await Menu.findByIdAndUpdate(id, updatedData, options);
          res.redirect(`/user/${slug}/edit`);
        }
      } else {
        res.render("error/404");
      }
    }
  }
);

router.post(
  "/menu/kategoriedit",
  upload.single("image"),
  marabacheck,
  async (req: any, res: any) => {
    const { error, value } = categoryValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      try {
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    } else {
      const { id, nametr, nameen, nameru, namefr } = req.body;

      const menu = await Kategori.findById(id);
      const mymenu = await Menu.findById(menu.Menu._id);
      const userid: any = req.token.id;
      const user = await User.findById(userid).populate("userMenu");
      const filter = user.userMenu.filter((item: any) => {
        return item.id === mymenu.id;
      });
      const Slug = mymenu.Slug;
      const filePath = "public/images";

      if (filter.length) {
        if (req.file) {
          const control = fs.existsSync(`${filePath}/${menu.image}`);

          if (control) {
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
              Nametr: nametr,
              Namefr: namefr,
              Nameen: nameen,
              Nameru: nameru,
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
              Nametr: nametr,
              Namefr: namefr,
              Nameen: nameen,
              Nameru: nameru,
              image: image,
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
          const updatedData = {
            Nametr: nametr,
            Namefr: namefr,
            Nameen: nameen,
            Nameru: nameru,
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
  }
);

router.post(
  "/menu/urunedit",
  upload.single("image"),
  marabacheck,
  async (req: any, res: any) => {
    const { error, value } = urunValidate.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      try {
        res.redirect("back");
      } catch (err) {
        console.log(err);
      }
    } else {
      const {
        nametr,
        id,
        price,
        descriptiontr,
        descriptionen,
        descriptionru,
        descriptionfr,
        nameen,
        nameru,
        namefr,
      } = req.body;

      const menu = await Urun.findById(id);
      const mycategory = await Kategori.findById(menu.Kategori._id);
      const mymenu = await Menu.findById(mycategory.Menu._id);
      const userid: any = req.token.id;
      const user = await User.findById(userid).populate("userMenu");
      const filter = user.userMenu.filter((item: any) => {
        return item.id === mymenu.id;
      });
      const filePath = "public/images";

      if (filter.length) {
        if (req.file) {
          const control = fs.existsSync(`${filePath}/${menu.image}`);

          if (control) {
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
              Nametr: nametr,
              Nameen: nameen,
              namefr: namefr,
              Nameru: nameru,
              image: image,
              Price: price,
              Descriptiontr: descriptiontr,
              Descriptionen: descriptionen,
              Descriptionfr: descriptionfr,
              Descriptionru: descriptionru,
            };
            const options = { new: true };
            await Urun.findByIdAndUpdate(id, updatedData, options);
            res.redirect(`/user/${mymenu.Slug}/edit2`);
          } else {
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
              Nametr: nametr,
              Nameen: nameen,
              namefr: namefr,
              Nameru: nameru,
              Price: price,
              image: image,
              Descriptiontr: descriptiontr,
              Descriptionen: descriptionen,
              Descriptionfr: descriptionfr,
              Descriptionru: descriptionru,
            };
            const options = { new: true };
            await Urun.findByIdAndUpdate(id, updatedData, options);
            res.redirect(`/user/${mymenu.Slug}/edit2`);
          }
        } else {
          const updatedData = {
            Nametr: nametr,
            Nameen: nameen,
            namefr: namefr,
            Nameru: nameru,
            Price: price,
            Descriptiontr: descriptiontr,
            Descriptionen: descriptionen,
            Descriptionfr: descriptionfr,
            Descriptionru: descriptionru,
          };
          const options = { new: true };
          await Urun.findByIdAndUpdate(id, updatedData, options);
          res.redirect(`/user/${mymenu.Slug}/edit2`);
        }
      }
    }
  }
);

router.post("/:id/menusil", marabacheck, async (req: any, res: any) => {
  const id = req.params.id;
  const menu: any = await Menu.findById(id).populate("Kategoriler");
  const userid: any = req.token.id;
  const user = await User.findById(userid).populate("userMenu");
  const filter = user.userMenu.filter((item) => {
    return item.id === menu.id;
  });
  const filePath = "public/images";
  if (filter.length) {
    const unlink = fs.existsSync(`${filePath}/${menu.image}`);

    if (unlink) {
      await fs.unlinkSync(`${filePath}/${menu.image}`);
      for (let i = 0; i < menu.Kategoriler.length; i++) {
        const kategori: any = await Kategori.findById(
          menu.Kategoriler[i].id
        ).populate("Urunler");
        if (kategori.image) {
          for (let x = 0; x < kategori.Urunler.length; x++) {
            if (kategori.Urunler[x].image) {
              const unlink3 = fs.existsSync(
                `${filePath}/${kategori.Urunler[x].image}`
              );

              if (unlink3) {
                await fs.unlinkSync(`${filePath}/${kategori.Urunler[x].image}`);
              }
            }
          }
          const unlink2 = fs.existsSync(
            `${filePath}/${menu.Kategoriler[i].image}`
          );

          if (unlink2) {
            await fs.unlinkSync(`${filePath}/${menu.Kategoriler[i].image}`);
          }
        } else {
          for (let x = 0; x < kategori.Urunler.length; x++) {
            if (kategori.Urunler[x].image) {
              const unlink3 = fs.existsSync(
                `${filePath}/${kategori.Urunler[x].image}`
              );

              if (unlink3) {
                await fs.unlinkSync(`${filePath}/${kategori.Urunler[x].image}`);
              }
            }
          }
        }
      }
      const data = await Menu.findByIdAndDelete(id);
      user.menuLeft += 1;
      await user.save();
      try {
        res.redirect(`/user/dashboard`);
      } catch (error) {
        res.status(404).render("error/404");
      }
    } else {
      for (let i = 0; i < menu.Kategoriler.length; i++) {
        const kategori: any = await Kategori.findById(
          menu.Kategoriler[i].id
        ).populate("Urunler");
        if (kategori.image) {
          for (let x = 0; x < kategori.Urunler.length; x++) {
            if (kategori.Urunler[x].image) {
              const unlink3 = fs.existsSync(
                `${filePath}/${kategori.Urunler[x].image}`
              );

              if (unlink3) {
                await fs.unlinkSync(`${filePath}/${kategori.Urunler[x].image}`);
              }
            }
          }
          const unlink2 = fs.existsSync(
            `${filePath}/${menu.Kategoriler[i].image}`
          );

          if (unlink2) {
            await fs.unlinkSync(`${filePath}/${menu.Kategoriler[i].image}`);
          }
        } else {
          for (let x = 0; x < kategori.Urunler.length; x++) {
            if (kategori.Urunler[x].image) {
              const unlink3 = fs.existsSync(
                `${filePath}/${kategori.Urunler[x].image}`
              );

              if (unlink3) {
                await fs.unlinkSync(`${filePath}/${kategori.Urunler[x].image}`);
              }
            }
          }
        }
      }
      const data = await Menu.findByIdAndDelete(id);
      user.menuLeft += 1;
      await user.save();
      try {
        res.redirect(`/user/dashboard`);
      } catch (error) {
        res.status(404).render("error/404");
      }
    }
  } else {
    res.render("error/404");
  }
});

router.post("/:id/kategorisil", marabacheck, async (req: any, res: any) => {
  const id = req.params.id;
  const category = await Kategori.findById(id);
  const mymenu = await Menu.findById(category.Menu._id);
  const userid: any = req.token.id;
  const user = await User.findById(userid).populate("userMenu");
  const filter = user.userMenu.filter((item: any) => {
    return item.id === mymenu.id;
  });
  const filePath = "public/images";
  if (filter.length) {
    if (category.image) {
      const control = fs.existsSync(`${filePath}/${category.image}`);

      if (control) {
        await fs.unlinkSync(`${filePath}/${category.image}`);
        const data = await Kategori.findByIdAndDelete(id);
        try {
          res.redirect(`/user/${mymenu.Slug}/edit2`);
        } catch (error) {
          res.render("error/401");
        }
      } else {
        const data = await Kategori.findByIdAndDelete(id);
        try {
          res.redirect(`/user/${mymenu.Slug}/edit2`);
        } catch (error) {
          res.render("error/401");
        }
      }
    } else {
      const data = await Kategori.findByIdAndDelete(id);
      try {
        res.redirect(`/user/${mymenu.Slug}/edit2`);
      } catch (error) {
        res.render("error/401");
      }
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
  const filter = user.userMenu.filter((item: any) => {
    return item.id === mymenu.id;
  });
  const filePath = "public/images";
  if (filter.length) {
    if (menu.image) {
      const control = fs.existsSync(`${filePath}/${menu.image}`);

      if (control) {
        try {
          await fs.unlinkSync(`${filePath}/${menu.image}`);
          const data = await Urun.findByIdAndDelete(id);
          res.redirect(`/user/${mymenu.Slug}/edit2`);
        } catch (error) {
          res.render("error/401");
        }
      } else {
        try {
          const data = await Urun.findByIdAndDelete(id);
          res.redirect(`/user/${mymenu.Slug}/edit2`);
        } catch (error) {
          res.render("error/401");
        }
      }
    } else {
      try {
        const data = await Urun.findByIdAndDelete(id);
        res.redirect(`/user/${mymenu.Slug}/edit2`);
      } catch (error) {
        res.render("error/401");
      }
    }
  } else {
    res.render("error/401");
  }
});

router.post("/login", async (req: any, res: Response) => {
  const { error, value } = userLoginValidate.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    try {
      req.flash("error", error.details);
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  } else {
    const { username, password } = req.body;

    const getuser = await User.findOne({ username: username });

    if (getuser && getuser.verified === true) {
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
          req.flash("error", { message: "Wrong Username or Password" });
          res.redirect("/login");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      req.flash("error", {
        message:
          "Please confirm your account with the link sent to your e-mail address.",
      });
      res.redirect("/login");
    }
  }
});

router.post("/register", async (req: any, res: Response) => {
  const { error, value } = userSignupValidate.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    try {
      req.flash("error", error.details);
      res.redirect("/register");
    } catch (err) {
      console.log(err);
    }
  } else {
    const username: string = req.body.username;
    const password: string = req.body.password;
    const email: string = req.body.email;

    const finduser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (finduser) {
      req.flash("error", { message: "Email or Username already Registered." });
      res.redirect("/register");
    } else {
      const newUser = new User({
        username: username,
        password: password,
        email: email,
        created_date: Date.now(),
      });

      try {
        await newUser.save();
        await sendMail(email);
        req.flash("error", {
          message:
            "Please confirm your account with the link sent to your e-mail address.",
        });
        res.redirect("/register");
      } catch (err) {
        console.log(err);
      }
    }
  }
});

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  // Verifying the JWT token
  const data = jwt.verify(token, secret);

  const finduser = await User.findOne({ email: data.mail });

  if (finduser) {
    finduser.verified = true;
    await finduser.save();
    res.redirect("/");
  } else {
    finduser.verified = false;
    res.redirect("/");
  }
});

module.exports = router;
