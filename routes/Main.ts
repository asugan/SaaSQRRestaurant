import express from "express";
const router = express.Router();

router.get("/", async (req: any, res: any) => {
  res.render("index");
});

module.exports = router;
