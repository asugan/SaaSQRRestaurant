import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();
import { Admin } from "../models/Admin";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const marabacheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret: Secret = process.env.SECRET;

  const token = req.cookies.OursiteJWT;

  if (token) {
    const verifying: any = await jwt.verify(token, secret);

    (req as CustomRequest).token = verifying;

    console.log("verifying", verifying);
    const finduser = await Admin.findById(verifying.id);

    if (finduser.userLevel === "Admin") {
      return next();
    } else {
      return res.status(401).render("error/notimeleft");
    }
  } else {
    return res.status(401).render("error/401");
  }
};
