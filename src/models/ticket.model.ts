import { Schema, model } from "mongoose";
import { ITicket } from "../interfaces/ticket.interface";

const TicketSchema = new Schema<ITicket>(
  {
    eventName: { type: String, required: true },
    owner: { type: String, unique: true, required: true },
    barcode: { type: String, required: true },
    buyDate: { type: Date, required: true },
    obliterationDate: { type: Date, required: false },
  },
  { versionKey: false }
);

export default model<ITicket>("tickets", TicketSchema);
