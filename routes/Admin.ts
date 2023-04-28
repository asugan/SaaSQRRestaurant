import express, { Request, Response } from "express";
import { Admin } from "../models/Admin";
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();

router.get("/createadmin", async (req: any, res: any) => {
  res.render("admin/createadmin");
});

router.get("/login", async (req: any, res: any) => {
  res.render("admin/login");
});

router.get("/dashboard", async (req: any, res: any) => {
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

router.post("/post", async (req: any, res: any) => {
  const { name } = req.body;

  console.log(name);
});

module.exports = router;
