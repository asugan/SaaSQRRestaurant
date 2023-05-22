import express, { Application } from "express";
import { connect } from "mongoose";
const vhost = require("vhost");
const { engine } = require("express-handlebars");
const app: Application = express();
const cors = require("cors");
const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const MainController = require("./routes/Main");
const MenuController = require("./routes/Menu");
const path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
import { checkUser } from "./crontasks/UserCheck";

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT: number = 3000;
const mongoString: string | undefined = process.env.DATABASE_URL;
const domain = process.env.DOMAIN;

const connectMongo = async () => {
  await connect(mongoString);
};

connectMongo().catch((err) => console.log(err));

app.set("view engine", "handlebars");

app.engine(
  "handlebars",
  engine({
    extname: "handlebars",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
      dotdotdot: function (str: string) {
        if (str.length > 40) return str.substring(0, 40) + "...";
        return str;
      },
      datehelper: function (date: any) {
        return date.toISOString().slice(0, 10);
      },
      ifeq: function (a: any, b: any, options: any) {
        if (a === b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
      doctype: function () {
        return new Handlebars.SafeString("<!DOCTYPE html>");
      },
    },
  })
);

app.set("views", path.join(__dirname, "/views/"));

app.use(express.static("public"));

app.use(vhost(`${domain}`, MainController));
app.use(vhost(`*.${domain}`, MenuController));
app.get("*", function (req, res) {
  res.status(404).render("error/404");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

checkUser.runschedule();
