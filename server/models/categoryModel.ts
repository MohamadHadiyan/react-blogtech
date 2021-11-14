import { Schema, model } from "mongoose";
import { ICategory } from "../config/interface";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name of category is required."],
      unique: true,
      trim: true,
      maxLength: [50, "Name is up to 50 characters long."],
    },
  },
  {
    timestamps: true,
  }
);

export default model<ICategory>("category", categorySchema);
