import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true },
    surname: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "No-Binary"],
        message:
          "{VALUE} is not supported, see the documentation for see acceptable values",
      },
      required: true,
    },
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verify_token: { type: String, required: false },
  },
  { versionKey: false, timestamps: true }
);

export default model<IUser>("users", UserSchema);
