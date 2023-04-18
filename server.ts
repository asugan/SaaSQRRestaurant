import express, { Application } from "express";
import { connect } from "mongoose";
const { engine } = require("express-handlebars");
const app: Application = express();
const cors = require("cors");
const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const MainController = require("./routes/Main");
const UserController = require("./routes/User");
const StripeController = require("./routes/Stripe");
const IyzicoController = require("./routes/Iyzico");
const OrderController = require("./routes/Order");
const path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const LemonController = require("./routes/Lemon");
// import { UserTask } from "./crontasks/Usertask";
import { checkUser } from "./crontasks/UserCheck";

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT: number = 3000;
const mongoString: string | undefined = process.env.DATABASE_URL;

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
    },
  })
);

app.set("views", path.join(__dirname, "/views/"));

app.use(express.static("public"));

app.use("/", MainController);
app.use("/user", UserController);
// app.use("/stripe", StripeController);
// app.use("/iyzipay", IyzicoController);
// app.use("/order", OrderController);
app.use("/lemon", LemonController);
app.get("*", function (req, res) {
  res.status(404).render("error/404");
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

checkUser.runschedule();
