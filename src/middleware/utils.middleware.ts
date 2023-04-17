import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const secretToken = String(process.env.SECRET_JWT);

// Check if use valid mongo id
export const checkIdValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = String(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ObjectId" });
  }
  res.locals.id = id;
  next();
};

// Create an array with possible express-validator error
export const checkErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Check if hava a valid token signature for POST,PUT,DELETE operation
export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authkey = String(req.headers.authorization);
  // Check if the JWT have same signature
  const uservalidation = jwt.verify(authkey, secretToken) as { id: string };
  res.locals.userFinded = await User.findById(uservalidation.id);
  if (res.locals.userFinded) {
    return next();
  } else {
    return res.status(400).json({ message: "Token not valid" });
  }
};

// Check unique email
export const uniqueEmail = async (
  { body: { email } }: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email is just present" });
  }
  next();
};
