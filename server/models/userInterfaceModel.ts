import { model, Schema } from "mongoose";
import { IUserInterface } from "../config/interface";

const userInterfaceSchema = new Schema({
  themeMode: { type: String, enum: ["dark", "light"], default: "light" },
  favouriteColor: {
    type: String,
    enum: [
      "purple",
      "primary",
      "success",
      "danger",
      "info",
      "warning",
      "secondary",
    ],
    default: "purple",
  },
  rightNavigation: { type: Boolean, default: true },
});

export default model<IUserInterface>("user_interface", userInterfaceSchema);
