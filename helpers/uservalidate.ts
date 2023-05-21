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
    .alphanum()
    .min(3)
    .message("Menü Adı Minimum 3 harf olmalı")
    .max(50)
    .required(),
  instagram: Joi.string()
    .min(3)
    .message("Instagram Minimum 3 harf olmalı")
    .max(100),
  facebook: Joi.string()
    .min(3)
    .message("Facebook Minimum 3 harf olmalı")
    .max(100),
  twitter: Joi.string()
    .min(3)
    .message("Twitter Minimum 3 harf olmalı")
    .max(100),
  whatsapp: Joi.string().min(3).message("Telefon Numarası Girin.").max(100),
  adres: Joi.string().min(3).message("Adres Minimum 3 harf olmalı").max(200),
  lang: Joi.string().min(1).message("Lang Minimum 3 harf olmalı").max(3),
  currency: Joi.string()
    .min(1)
    .message("Currency Minimum 3 harf olmalı")
    .max(5),
  menuid: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(20),
});

export const categoryValidate = Joi.object({
  name: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50)
    .required(),
  nametr: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  namefr: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  nameru: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  nameen: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  idmenu: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  menuid: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  id: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
});

export const urunValidate = Joi.object({
  name: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50)
    .required(),
  nametr: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  namefr: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  nameru: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  nameen: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(50),
  menuid: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  price: Joi.string().min(1).message("Menuid Minimum 3 harf olmalı").max(30),
  description: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(300),
  descriptiontr: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(300),
  descriptionfr: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(300),
  descriptionru: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(300),
  descriptionen: Joi.string()
    .min(3)
    .message("Kategori Adı Minimum 3 harf olmalı")
    .max(300),
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
