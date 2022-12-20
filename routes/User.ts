import express from "express";
const router = express.Router();
const User = require("../models/User");

router.get("/register", async (req: any, res: any) => {
  res.render("user/register");
});

router.post("/register", async (req: any, res: any) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  const newUser = new User({
    username: username,
    password: password,
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
