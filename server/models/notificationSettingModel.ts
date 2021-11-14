import { model, Schema } from "mongoose";
import { INotifySettings } from "../config/interface";

const notificationSettingSchema = new Schema({
  getNotification: { type: Boolean, default: true },
  security: { type: Boolean, default: true },
  news: { type: Boolean, default: true },
  profileUpdates: { type: Boolean, default: true },
  mentions: { type: Boolean, default: true },
  messages: { type: Boolean, default: true },
  blogComments: { type: Boolean, default: true },
  blogLikes: { type: Boolean, default: true },
  followings: { type: Boolean, default: true },
  commentReplies: { type: Boolean, default: true },
  commentLikes: { type: Boolean, default: true },
});

export default model<INotifySettings>(
  "notification_setting",
  notificationSettingSchema
);
