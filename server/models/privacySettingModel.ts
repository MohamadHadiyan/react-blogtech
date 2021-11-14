import { model, Schema } from "mongoose";
import { IPrivacySetting } from "../config/interface";

const privacySettingSchema = new Schema({
  privacy: { type: String, enum: ["private", "public"], default: "public" },
  showBlogs: { type: Boolean, default: true },
  showFollowings: { type: Boolean, default: true },
});

export default model<IPrivacySetting>("privacy_setting", privacySettingSchema);
