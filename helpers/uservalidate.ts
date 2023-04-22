const Joi = require("joi");

export const userSignupValidate = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(10)
    .message("10 harf olmalı")
    .max(30)
    .required(),
  email: Joi.string().email().message("required").required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$")),
  // confirmPassword: Joi.ref("password"),
});
