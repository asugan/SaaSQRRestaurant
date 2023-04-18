const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const secret = "mysecret";

export const sendMail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "cagatayeren1898@gmail.com",
      pass: "bznzjyzrnoqlpudj",
    },
  });

  const token = jwt.sign(
    {
      mail: email,
    },
    secret,
    { expiresIn: "10m" }
  );

  const mailConfigurations = {
    // It should be a string of sender/server email
    from: "cagatayeren1898@gmail.com",

    to: email,

    // Subject of Email
    subject: "Email Verification",

    // This would be the text of email body
    text: `Hi! There, You have recently visited
		our website and entered your email.
		Please follow the given link to verify your email
		http://localhost:3000/user/verify/${token}
		Thanks`,
  };

  transporter.sendMail(mailConfigurations, function (error: any, info: any) {
    if (error) throw Error(error);
  });
};
