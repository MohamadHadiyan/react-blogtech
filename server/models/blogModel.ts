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
      trim: true,
      minLength: 5,
      maxLength: 100,
      default: "",
    },
    thumbnail: { type: String },
    category: {
      type: Types.ObjectId,
      ref: "category",
    },
    description: {
      type: String,
      trim: true,
      maxLength: 300,
      default: "",
    },
    content: {
      type: String,
      default: "",
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
    readingTime: { type: Number, default: 5 },
    views: { type: Number, default: 0 },
    privacy: { type: String, default: "public" },
  },
  {
    timestamps: true,
  }
);

export default model<IBlog>("blog", blogSchema);
