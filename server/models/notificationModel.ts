import { model, Schema, Types } from "mongoose";
import { INotification } from "../config/interface";

const notificationSchema = new Schema(
  {
    title: { type: String },
    image: { type: String },
    description: { type: String },
    sender: Types.ObjectId,
    receiver: Types.ObjectId,
    link: { type: String },
    viewed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model<INotification>("notification", notificationSchema);
