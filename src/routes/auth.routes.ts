import express, { Request, Response } from "express";
import { body } from "express-validator";
import { checkErrors, uniqueEmail } from "../middleware/utils.middleware";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../interfaces/user.interface";
import jwt from "jsonwebtoken";

dotenv.config();

const salt_round = Number(process.env.SALT);
const secret_key = String(process.env.KEY);

const router = express.Router();
router.use(express.json());

// GET
router.get(
  "/validate/:verifytoken",
  async ({ params: { verifytoken } }: Request, res: Response) => {
    try {
      const validationUser = await User.findOneAndUpdate(
        { verify_token: verifytoken },
        { $unset: { verify_token: 1 } }
      );
      if (validationUser) {
        return res
          .status(200)
          .json({ message: "User enabled to CRUD operation" });
      }
      return res
        .status(400)
        .json({ message: "This token is not associated with any user" });
    } catch (error) {
      return res.status(400).json({ error_message: error });
    }
  }
);

// POST
router.post(
  "/signin",
  body("firstname").notEmpty(),
  body("surname").notEmpty(),
  body("username").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 8 }).notEmpty(),
  checkErrors,
  uniqueEmail,
  async ({ body }: Request, res: Response) => {
    const newUser: IUser = {
      firstname: body.firstname,
      surname: body.surname,
      age: body.age,
      gender: body.gender,
      username: body.username,
      email: body.email,
      password: await bcrypt.hash(body.password, salt_round),
      verify_token: uuidv4(),
    };
    try {
      const createUser = await User.create(newUser);
      if (createUser) {
        return res.status(201).json({
          firstname: body.firstname,
          surname: body.surname,
          age: body.age,
          gender: body.gender,
          username: body.username,
          email: body.email,
        });
      }
    } catch (error) {
      return res.status(400).json({ error_message: error });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }).notEmpty(),
  checkErrors,
  async ({ body }: Request, res: Response) => {
    try {
      const user = await User.findOne({
        email: body.email,
        verify_token: { $exists: false },
      });
      if (user) {
        const comparePasword = await bcrypt.compare(
          body.password,
          user.password
        );
        if (comparePasword) {
          return res.status(200).json({
            message: "Auth Successful",
            token: jwt.sign(
              {
                name: user.firstname,
                surname: user.surname,
                email: user.email,
              },
              secret_key
            ),
          });
        }
        return res.status(401).json({ message: "Wrong Password" });
      }
      return res.status(401).json({ message: "User not verified" });
    } catch (error) {
      return res.status(400).json({ error_message: error });
    }
  }
);

export default router;
