const Joi = require("joi");

export const userLoginValidate = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .message("Minimum 3 harf olmalı")
    .max(30)
    .required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
});

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

export const menuValidate = Joi.object({
  name: Joi.string()
    .min(3)
    .message("Menü Adı Minimum 3 harf olmalı")
    .max(100)
    .required(),
  instagram: Joi.string()
    .min(3)
    .message("Instagram Minimum 3 harf olmalı")
    .max(200)
    .allow(""),
  facebook: Joi.string()
    .min(3)
    .message("Facebook Minimum 3 harf olmalı")
    .max(200)
    .allow(""),
  twitter: Joi.string()
    .min(3)
    .message("Twitter Minimum 3 harf olmalı")
    .max(200)
    .allow(""),
  whatsapp: Joi.string()
    .min(3)
    .message("Telefon Numarası Girin.")
    .max(200)
    .allow(""),
  adres: Joi.string()
    .min(3)
    .message("Adres Minimum 3 harf olmalı")
    .max(400)
    .allow(""),
  lang: Joi.string().min(1).message("Lang Minimum 3 harf olmalı").max(3),
  currency: Joi.string()
    .min(1)
    .message("Currency Minimum 3 harf olmalı")
    .max(5),
  menuid: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(20),
  id: Joi.string()
    .min(1)
    .message("Menuid Minimum 3 harf olmalı")
    .max(30)
    .allow(""),
});

export const categoryValidate = Joi.object({
  nametr: Joi.string().allow("").max(100),
  namefr: Joi.string().allow("").max(100),
  nameru: Joi.string().allow("").max(100),
  nameen: Joi.string().allow("").max(100),
  idmenu: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  menuid: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  id: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
});

export const urunValidate = Joi.object({
  nametr: Joi.string().allow("").max(100),
  namefr: Joi.string().allow("").max(100),
  nameru: Joi.string().allow("").max(100),
  nameen: Joi.string().allow("").max(100),
  menuid: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  price: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  descriptiontr: Joi.string().allow("").max(600),
  descriptionfr: Joi.string().allow("").max(600),
  descriptionru: Joi.string().allow("").max(600),
  descriptionen: Joi.string().allow("").max(600),
  currency: Joi.string()
    .min(1)
    .message("Currency Minimum 3 harf olmalı")
    .max(5),
  kategori: Joi.string()
    .min(1)
    .message("Currency Minimum 3 harf olmalı")
    .max(50),
  id: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
});
