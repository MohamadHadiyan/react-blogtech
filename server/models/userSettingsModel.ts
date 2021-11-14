import { model, Schema, Types } from "mongoose";
import { IUserSetting } from "../config/interface";

const userSettingSchema = new Schema({
  user: { type: Types.ObjectId, ref: "user" },
  notificationSetting: { type: Types.ObjectId, ref: "notification_setting" },
  privacySetting: { type: Types.ObjectId, ref: "privacy_setting" },
  socialProfiles: { type: Types.ObjectId, ref: "social_profiles" },
  userInterface: { type: Types.ObjectId, ref: "user_interface" },
});

export default model<IUserSetting>("user_setting", userSettingSchema);
