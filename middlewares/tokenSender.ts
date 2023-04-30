const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

export const sendMail = async (email: string) => {
  const secret = process.env.SECRET;
  const mail = process.env.MAIL;
  const pass = process.env.MAILPASS;
  const domain = process.env.DOMAIN;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: mail,
      pass: pass,
    },
  });

  const token = jwt.sign(
    {
      mail: email,
    },
    secret,
    { expiresIn: "365d" }
  );

  const mailConfigurations = {
    // It should be a string of sender/server email
    from: mail,

    to: email,

    // Subject of Email
    subject: "Email Verification",

    // This would be the text of email body
    text: `Hi! There, You have recently visited
		our website and entered your email.
		Please follow the given link to verify your email
		http://${domain}:3000/user/verify/${token}
		Thanks`,
  };

  transporter.sendMail(mailConfigurations, function (error: any, info: any) {
    if (error) throw Error(error);
  });
};
