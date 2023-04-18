import express, { Request, Response } from "express";
import { body, header } from "express-validator";
import {
  checkErrors,
  checkIdValid,
  uniqueBuyer,
  uniqueEvent,
} from "../middleware/utils.middleware";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
// EVENT MODEL
import Event from "../models/event.model";
// TICKET MODEL
import Ticket from "../models/ticket.model";
import { IEvent } from "../interfaces/event.interface";
import { ITicket } from "../interfaces/ticket.interface";

dotenv.config();

const router = express.Router();
router.use(express.json());

// GET ALL EVENT
router.get("/", async ({ query }, res) => {
  try {
    const allEvent = await Event.find(query);
    if (allEvent) return res.status(200).json(allEvent);
    return res.status(400).json({ message: "Error to find all events" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

//SEARCH EVENT BY ID
router.get("/:id", checkIdValid, checkErrors, async (_, res) => {
  try {
    const findByID = await Event.findById(res.locals.id);
    if (!findByID) return res.status(404).json({ message: "Event not found" });
    return res.status(200).json(findByID);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// CREATE EVENT
router.post(
  "/",
  body("name").notEmpty(),
  body("typology").notEmpty(),
  body("availablePlaces").notEmpty(),
  body("location.city").notEmpty(),
  body("location.address").notEmpty(),
  body("location.postalCode").notEmpty(),
  body("ticketsPrice").notEmpty(),
  checkErrors,
  uniqueEvent,
  async ({ body }, res) => {
    const newEvent: IEvent = {
      name: body.name,
      typology: body.typology,
      availablePlaces: body.availablePlaces,
      location: {
        city: body.location.city,
        address: body.location.address,
        postalCode: body.location.postalCode,
      },
      ticketsPrice: body.ticketsPrice,
    };
    try {
      await Event.create(newEvent);
      if (newEvent) return res.status(200).json({ Event: newEvent });
      return res.status(400).json({ message: "Error to creare event" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
);

// TICKET INFO
router.get("/:id/tickets", checkIdValid, checkErrors, async (req, res) => {
  const eventID = res.locals.id;
  try {
    const findEvent = await Event.findById({ _id: eventID });
    if (findEvent)
      return res.status(200).json({
        eventName: findEvent.name,
        availablePlaces: findEvent.availablePlaces,
      });
    return res.status(404).json({ message: "Event not found" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
});

// UPDATE EVENT
router.put("/:id", checkIdValid, checkErrors, async ({ body }, res) => {
  const id = res.locals.id;
  const eventToUpdate: IEvent = body;
  try {
    const updateDoc = await Event.findByIdAndUpdate(
      id,
      {
        $set: eventToUpdate,
      },
      { new: true, runValidators: true, useFindAndModify: false }
    );
    if(updateDoc) return res.status(200).send(updateDoc);
    res.status(400).json({messge:"Event to update not found, wrong or invalid ID"});
  } catch (error) {
    return res.status(400).json({ error: "MISSING REQUIRED FIELD" });
  }
});

// DELETE EVENT
router.delete("/:id", checkIdValid, checkErrors, async (_, res) => {
  try {
    const eventToDelete = await Event.findByIdAndDelete(res.locals.id);
    if (!eventToDelete) {
      return res.status(404).json({ error: "Event not found" });
    }
    const deleteTicket = await Ticket.deleteMany({
      eventName: eventToDelete.name,
    });
    if (!deleteTicket)
      return res.status(400).json({ error: "Erro to delete sell ticket" });
    return res.json({ message: "Event and all ticket as been deleted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error to delete event" });
  }
});

// BUY TICKET
router.post(
  "/:id/tickets",
  checkIdValid,
  body("owner").notEmpty(),
  checkErrors,
  uniqueBuyer,
  async (req, res) => {
    const eventID = res.locals.id;
    try {
      const findEvent = await Event.findById({ _id: eventID });
      if (findEvent) {
        if (findEvent.availablePlaces > 0) {
          const newTicket: ITicket = {
            eventName: findEvent.name,
            owner: req.body.owner,
            barcode: uuidv4(),
            buyDate: new Date(),
          };
          try {
            const createTicket = await Event.updateOne(
              { _id: eventID },
              { $inc: { availablePlaces: -1 } }
            );
            if (createTicket) {
              await Ticket.create(newTicket);
              return res.status(200).json(newTicket);
            }
            return res.status(400).json({ message: "Error to create ticket" });
          } catch (error) {
            return res.status(400).json({ message: error });
          }
        }
        return res.status(400).json({
          message: "Sorry there are no more places available for this event",
        });
      }
      return res.status(400).json({ messame: "Event non found" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  }
);

export default router;
