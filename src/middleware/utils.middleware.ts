import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import Event from "../models/event.model";
import Ticket from "../models/ticket.model";
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

export const uniqueEvent = async (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  const event = await Event.findOne({
    name: body.name,
    "location.city": body.location.city,
  });
  if (event) {
    return res.status(409).json({ message: "Event is just present" });
  }
  next();
};


export const uniqueBuyer = async (
  { body }: Request,
  res: Response,
  next: NextFunction
) => {
  const buyer = await Ticket.findOne({owner: body.owner});
  if (buyer) {
    return res.status(409).json({ message: "Each user can purchase only one ticket" });
  }
  next();
};


export const checkBodyValid = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Take key into che user schema
  const validKeys = Object.keys(Event.schema.obj);

  // Take key into the body
  const bodyKeys = Object.keys(req.body);

  // Compare validKeys and bodyKeys
  const invalidKeys = bodyKeys.filter((key) => !validKeys.includes(key));

  // Se sono presenti chiavi non valide, restituisci un errore
  if (invalidKeys.length) {
    const errorMsg = `Invalid key(s) found in request body: ${invalidKeys.join(
      ", "
    )}`;
    return res.status(400).json({ error: errorMsg });
  }
  next();
};