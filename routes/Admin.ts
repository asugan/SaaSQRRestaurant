import express, { Request, Response } from "express";
import { Admin } from "../models/Admin";
import { AdminCheck } from "../middlewares/AdminCheck";
import { Post } from "../models/Post";
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const multer = require("multer");
const path = require("path");
const SharpMulter = require("sharp-multer");

const secret: string = process.env.SECRET;

const storage: any = SharpMulter({
  destination: (req: any, file: any, cb: any) => {
    cb(null, path.resolve("public/blogimage"));
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

router.get("/createadmin", async (req: any, res: any) => {
  res.render("admin/createadmin");
});

router.get("/login", async (req: any, res: any) => {
  res.render("admin/login");
});

router.get("/dashboard", AdminCheck, async (req: any, res: any) => {
  res.render("admin/dashboard/index");
});

router.post("/createadmin", async (req: any, res: any) => {
  const { password } = req.body;

  const user = await Admin.findOne({ username: "asugan" });

  if (password === "a1s2u3g4a5n6") {
    if (user) {
      res.redirect("/admin/login");
    } else {
      const newAdmin = new Admin({
        username: "asugan",
        password: "a1s2u3g4a5n6",
      });

      await newAdmin.save();

      res.redirect("/admin/login");
    }
  } else {
    res.redirect("/admin/createadmin");
  }
});

router.post(
  "/post",
  upload.single("image"),
  AdminCheck,
  async (req: any, res: any) => {
    const { body, title, desc, urlen, urltr, urles, urlfr } = req.body;
    const image = req.file.filename;

    const mypost = new Post({
      Body: body,
      Title: title,
      Desc: desc,
      Urlen: urlen,
      Urles: urles,
      Urlfr: urlfr,
      Urltr: urltr,
      Image: image,
    });

    try {
      await mypost.save();
      res.redirect("back");
    } catch (err) {
      console.log(err);
    }
  }
);

router.post(
  "/uploader",
  multipartMiddleware,
  AdminCheck,
  (req: any, res: any) => {
    var fs = require("fs");
    let html;

    fs.readFile(req.files.upload.path, function (err: any, data: any) {
      var newPath = __dirname + "/../public/blogimage/" + req.files.upload.name;
      fs.writeFile(newPath, data, function (err: any) {
        if (err) console.log({ err: err });
        else {
          html = "";
          html += "<script type='text/javascript'>";
          html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
          html +=
            '    var url     = "/blogimage/' + req.files.upload.name + '";';
          html += '    var message = "Uploaded file successfully";';
          html += "";
          html +=
            "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
          html += "</script>";

          res.send(html);
        }
      });
    });
  }
);

router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;

  const getuser = await Admin.findOne({ username: username });

  try {
    if (await bcrypt.compare(password, getuser.password)) {
      const token = sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30, // 30 days
          id: getuser._id,
        },
        secret
      );

      const serialised = serialize("AdminJWT", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      res.setHeader("Set-Cookie", serialised);

      res.status(200).redirect("/admin/dashboard");
    } else {
      res.redirect("/admin/login");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
