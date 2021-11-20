import { Schema, model, Types } from "mongoose";
import { IUser } from "../config/interface";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name."],
      trim: true,
      max: [20, "Your name is up to 20 characters login."],
    },
    surname: {
      type: String,
      trim: true,
      max: [20, "Your name is up to 20 characters login."],
    },
    account: {
      type: String,
      required: [true, "Please enter your email or phone number."],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password."],
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user2-128.png",
    },
    coverImg: { type: String, default: "" },
    heading: { type: String, default: "" },
    intro: { type: String, default: "" },
    type: {
      type: String,
      enum: ["register", "facebook", "google"],
      default: "register",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    privacy: { type: String, enum: ["private", "public"], default: "public" },
    settings: { type: Types.ObjectId, ref: "user_setting" },
    notifications: [{ type: Types.ObjectId, ref: "notification" }],
    blogs: [{ type: Types.ObjectId, ref: "blog" }],
    favourites: [{ type: Types.ObjectId, ref: "blog" }],
    followers: [{ type: Types.ObjectId, ref: "user" }],
    followings: [{ type: Types.ObjectId, ref: "user" }],
    rf_token: { type: String, select: false },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("user", userSchema);
