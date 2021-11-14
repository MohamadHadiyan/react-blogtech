import { model, Schema } from "mongoose";
import { ISocialProfiles } from "../config/interface";

const socialProfilesSchema = new Schema({
  twitter: { type: String, default: "" },
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  linkedin: { type: String, default: "" },
  youtube: { type: String, default: "" },
  website: { type: String, default: "" },
});

export default model<ISocialProfiles>("social_profiles", socialProfilesSchema);
