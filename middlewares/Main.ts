import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
require("dotenv").config();

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const secret: Secret = process.env.SECRET;

  const token = req.cookies.OursiteJWT;

  if (token) {
    const verifying = await jwt.verify(token, secret);

    (req as CustomRequest).token = verifying;

    console.log("verifying", verifying);

    return next();
  } else {
    return res.status(401).render("error/401");
  }
};
