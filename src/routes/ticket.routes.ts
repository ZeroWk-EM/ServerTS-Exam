import express, { Request, Response } from "express";
import dotenv from "dotenv";

// TICKET MODEL
import Ticket from "../models/ticket.model";


dotenv.config();

const router = express.Router();
router.use(express.json());

router.get("/", async ({ query }, res) => {
  try {
    const allTicket = await Ticket.find(query);
    if (allTicket) return res.status(200).json(allTicket);
    return res.status(400).json({ message: "Error to find all tickets" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

export default router;
