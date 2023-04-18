import request from "supertest";
require("chai").should();

import app from "../app";
// MODEL
import Event from "../models/event.model";
import Ticket from "../models/ticket.model";
// INTERFACE
import { IEvent } from "../interfaces/event.interface";
import { ITicket } from "../interfaces/ticket.interface";
// UUIDV for create barcode ticket
import { v4 as uuidv4 } from "uuid";

import dotenv from "dotenv";
import { use } from "chai";
dotenv.config();

const base_auth = "/api/v1";

describe("ENDPOINT", () => {
  // EVENT
  const event: IEvent = {
    name: "Maneskin SRN",
    typology: "Concert",
    availablePlaces: 150,
    location: {
      city: "Roma",
      address: "Via Colosseo 12",
      postalCode: "00192",
    },
    ticketsPrice: 40,
  };

  describe("Event", () => {
    let newEvent: IEvent;
    //
    before(async () => {
      newEvent = {
        name: "Nirvana",
        typology: "Concert",
        availablePlaces: 150,
        location: {
          city: "Milano",
          address: "SS125",
          postalCode: "00192",
        },
        ticketsPrice: 40,
      };
      await Event.create(newEvent);
    });
    //
    after(async () => {
      await Event.deleteOne({
        name: event.name,
        "location.city": event.location.city,
      });
    });

    // 01
    it("[200] - Get all event", async () => {
      const { body, status } = await request(app).get(`${base_auth}/events`);
      status.should.be.equal(200);
    });

    // 02
    it("[200] - Get event with query params", async () => {
      const { body, status } = await request(app).get(
        `${base_auth}/events?name=Nirvana`
      );
      status.should.be.equal(200);
    });

    // 03
    it("[400] - Create event", async () => {
      const { body, status } = await request(app)
        .post(`${base_auth}/events`)
        .set(newEvent);
      status.should.be.equal(400);
    });

    // 04
    it("[400] - Create event with same name and place", async () => {
      const { body, status } = await request(app)
        .post(`${base_auth}/events`)
        .set(newEvent);
      status.should.be.equal(400);
    });

    // 05
    it("[200] - Update event", async () => {
      const updateField = {
        availablePlaces: 150,
        ticketsPrice: 500,
      };
      const findEvent = await Event.findOne({
        name: newEvent.name,
        "location.city": newEvent.location.city,
      });

      const { body, status } = await request(app)
        .put(`${base_auth}/events/${findEvent!._id}`)
        .set(updateField);
      status.should.be.equal(200);
    });

    it.skip("[400] - Update event with BAD field", async () => {
      const updateField = {
        badfield: "10",
      };

      const findEvent = await Event.findOne({
        name: newEvent.name,
        "location.city": newEvent.location.city,
      });
      const { body, status } = await request(app)
        .put(`${base_auth}/events/${findEvent!._id}`)
        .set(updateField);
      status.should.be.equal(400);
    });
    // END EVENT BLOCK
  });

  describe("Ticket", () => {
    // 01
    it("[200] - Get all ticket", async () => {
      const { body, status } = await request(app).get(`${base_auth}/tickets`);
      status.should.be.equal(200);
    });
    // END TICKET BLOCK
  });
  // END ENDPOINT BLOCK
});
