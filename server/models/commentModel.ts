import { model, Schema, Types } from "mongoose";
import { IComment } from "../config/interface";

const commentSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    content: {
      type: String,
      required: true,
    },
    blog_id: Types.ObjectId,
    blog_user_id: Types.ObjectId,
    replyCM: [
      {
        type: Types.ObjectId,
        ref: "comment",
      },
    ],
    reply_user: {
      type: Types.ObjectId,
      ref: "user",
    },
    comment_root: {
      type: Types.ObjectId,
      ref: "comment",
    },
    likes: [{ type: Types.ObjectId, ref: "user" }],
    dislikes: [{ type: Types.ObjectId, ref: "user" }],
  },
  {
    timestamps: true,
  }
);

export default model<IComment>("comment", commentSchema);
