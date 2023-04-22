const Joi = require("joi");

export const userSignupValidate = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .message("Minimum 3 harf olmalı")
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .message("Email formatı düzgün değil !")
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
  confirmpassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Şifreler Uyuşmuyor !",
  }),
  confirmemail: Joi.any().valid(Joi.ref("email")).required().messages({
    "any.only": "Epostalar Uyuşmuyor !",
  }),
});
