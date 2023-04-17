import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import dotenv from "dotenv";

dotenv.config();
const salt_round = Number(process.env.SALT_ROUND);
require("chai").should();

const base_auth = "/v1/auth";

describe("Endpoints", () => {
  const user: IUser = {
    firstname: "Emanuele",
    surname: "Moncada",
    age: 20,
    gender: "Male",
    username: "wkasper",
    email: "em@zerowk.it",
    password: "passwordmoltolunga",
  };

  // BLOCCO 01
  describe("Signup", () => {
    after(async () => {
      await User.deleteOne({ email: user.email });
    });

    // TEST 01
    it("[400] Wrong Email", async () => {
      const { status } = await request(app)
        .post(`${base_auth}/signin`)
        .send(
          User.findOneAndUpdate({ email: user.email }, { email: "wrong-email" })
        );
      status.should.be.equal(400);
    });

    //TEST 02
    it("[400] - Missing Name", async () => {
      const userWithoutName = User.findOneAndUpdate(
        { email: user.email },
        { $unset: { name: 1 } }
      );
      const { status } = await request(app)
        .post(`${base_auth}/signin`)
        .send(userWithoutName);
      status.should.be.equal(400);
    });

    // TEST 03
    it("[400] - Short Password", async () => {
      const userWithShortPassword = User.findOneAndUpdate(
        { email: user.email },
        { password: "12345" }
      );
      const { status } = await request(app)
        .post(`${base_auth}/signin`)
        .send(userWithShortPassword);
      status.should.be.equal(400);
    });

    // TEST 04
    it("[201] - Signup", async () => {
      const { body, status } = await request(app)
        .post(`${base_auth}/signin`)
        .send(user);
      status.should.be.equal(201);
      body.should.have.property("firstname").equal(user.firstname);
      body.should.have.property("surname").equal(user.surname);
      body.should.have.property("age").equal(user.age);
      body.should.have.property("gender").equal(user.gender);
      body.should.have.property("username").equal(user.username);
      body.should.have.property("email").equal(user.email);
      body.should.not.have.property("password");
      body.should.not.have.property("verify_token");
    });

    // TEST 05
    it("[409] - Email is just present", async () => {
      const { status } = await request(app)
        .post(`${base_auth}/signin`)
        .send(user);
      status.should.be.equal(409);
    });
  });

  // BLOCCO 02
  describe("Validate", () => {
    let newUser: IUser;
    before(async () => {
      newUser = {
        firstname: "Emanuele",
        surname: "Moncada",
        age: 20,
        gender: "Male",
        username: "wkasper",
        email: "em@gmail.com",
        password: "cript-password",
        verify_token: uuidv4(),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("[400] Invalid token", async () => {
      const { status } = await request(app).get(
        `${base_auth}/validate/fake-token`
      );
      status.should.be.equal(400);
    });

    // TEST 02
    it.skip("Test [200] Set token", async () => {
      const { status } = await request(app).get(
        `${base_auth}/validate/${newUser.verify_token}`
      );
      status.should.be.equal(200);
      const userFinded = await User.findOne({ email: newUser.email });
      userFinded!.should.not.have.property("verify_token");
    });
  });

  // BLOCCO 03
  describe("Login", () => {
    let newUser: IUser;
    let password = "password";
    before(async () => {
      newUser = {
        firstname: "Emanuele",
        surname: "Moncada",
        age: 20,
        gender: "Male",
        username: "wkasper",
        email: "em@gmail.com",
        password: await bcrypt.hash(password, salt_round),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("[400] Wrong data", async () => {
      const { status } = await request(app)
        .post(`${base_auth}/login`)
        .send({ email: "wrongmail", password: "A simple password" });
      status.should.be.equal(400);
    });

    // TEST 02
    it("Test [401] Invalid credentials", async () => {
      const { status } = await request(app)
        .post(`${base_auth}/login`)
        .send({ email: newUser.email, password: "wrong-password" });
      status.should.be.equal(401);
    });

    //TEST 03
    it("Test [200] Login success", async () => {
      const { status, body } = await request(app)
        .post(`${base_auth}/login`)
        .send({ email: newUser.email, password });
      status.should.be.equal(200);
      body.should.have.property("token");
    });
  });

  // BLOCCO 04
  describe("Login with not confirmed user", () => {
    let newUser: IUser;
    let password = "password";
    before(async () => {
      newUser = {
        firstname: "Emanuele",
        surname: "Moncada",
        age: 20,
        gender: "Male",
        username: "wkasper",
        email: "em@gmail.com",
        password: await bcrypt.hash(password, salt_round),
        verify_token: uuidv4(),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("[401] Login not success (while email is not verified)", async () => {
      const { status } = await request(app)
        .post(`${base_auth}/login`)
        .send({ email: newUser.email, password });
      status.should.be.equal(401);
    });
  });

  // BLOCCO 05
  describe("Me", () => {
    let newUser: IUser;
    let password = "password";
    before(async () => {
      newUser = {
        firstname: "Emanuele",
        surname: "Moncada",
        age: 20,
        gender: "Male",
        username: "wkasper",
        email: "em@gmail.com",
        password: await bcrypt.hash(password, salt_round),
      };
      await User.create(newUser);
    });
    after(async () => {
      await User.findOneAndDelete({ email: newUser.email });
    });

    // TEST 01
    it("Test [400] Token wrong", async () => {
      const { status } = await request(app)
        .post(`${base_auth}/login`)
        .set({ authorization: "wrong-token" });
      status.should.be.equal(400);
    });
  });
});
