import { Schema, model } from "mongoose";
import { IEvent } from "../interfaces/event.interface";

const EventSchema = new Schema<IEvent>(
  {
    name: { type: String, required: true },
    typology: {
      type: String,
      enum: {
        values: ["Sport", "Convention", "Fair", "Concert"],
        message:
          "{VALUE} is not supported, see the documentation for see acceptable values",
      },
      required: true,
    },
    availablePlaces: { type: Number, required: true },
    location: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    ticketsPrice: { type: Number, required: true },
  },
  { versionKey: false, timestamps: true }
);

export default model<IEvent>("events", EventSchema);
