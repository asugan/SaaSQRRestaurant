import express, { Application } from "express";
const { engine } = require("express-handlebars");
const app: Application = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const MainController = require("./routes/Main");
const UserController = require("./routes/User");
const path = require("path");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT: number = 3000;
const mongoString: string | undefined = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error: string) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

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
    },
  })
);

app.set("views", path.join(__dirname, "/views/"));

app.use(express.static("public"));

app.use("/", MainController);
app.use("/user", UserController);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
