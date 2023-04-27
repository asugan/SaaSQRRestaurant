import express, { Request, Response } from "express";
import { Admin } from "../models/Admin";
const router = express.Router();
const bcrypt = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();

router.get("/", async (req: any, res: any) => {
  res.render("admin/dashboard/index");
});

module.exports = router;
