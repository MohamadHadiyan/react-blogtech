import { Schema, model, Types } from "mongoose";
import { ITag } from "../config/interface";

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name of tag is required."],
      unique: true,
      tirm: true,
      maxLength: [50, "Name is up to 50 characters long."],
    },
    creator: {
      type: Types.ObjectId,
      ref: "user",
    },
    consumers: [
      {
        type: Types.ObjectId,
        ref: "blog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model<ITag>("tag", tagSchema);
