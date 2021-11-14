import { model, Schema, Types } from "mongoose";
import { IBlog } from "../config/interface";

const blogSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 5,
      maxLength: 100,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 50,
      maxLength: 300,
    },
    content: {
      type: String,
      required: true,
      minLength: 2000,
    },
    tags: [
      {
        type: Types.ObjectId,
        ref: "tag",
      },
    ],
    comments: [
      {
        type: Types.ObjectId,
        ref: "comment",
      },
    ],
    likes: [
      {
        type: Types.ObjectId,
        ref: "user",
      },
    ],
    views: { type: Number },
    privacy: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model<IBlog>("blog", blogSchema);
