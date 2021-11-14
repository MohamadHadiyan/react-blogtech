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

/* 
const userSchema = new Schema({
    first_name: { type: String,default:'',required:true},
    last_name: { type: String,default:'',required:true},
    email:  { type: String,unique:true,required:true,index: true},
    email_verified :{type: Boolean,default:false},
    email_verify_token:{type: String,default:null},
    phone:  { type: String,default:''},
    phone_verified :{type: Boolean,default:false},
    phone_otp_number:{type:Number,default:null},
    phone_otp_expired_at:{ type: Date,default:null},
    avatar:  { type: String,default:''},
    password: { type: String,required:true},
    password_reset_token:{type: String,default:null},
    reset_token_expired_at: { type: Date,default:null},
    active: { type: Boolean,default:true}
    account_type: { type: String, enum: ['single', 'organization'], default: 'single' },
    organization: {type:Schema.Types.Mixed,default:{}},
    billing_address: { type: String,default:''}
    shipping_address: { type: String,default:''}
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    permission: [
        {
            type: {  type: Schema.Types.ObjectId, ref: 'permissionType', required: true  },
            read: { type: Boolean, default: false, required: true  },
            write: { type: Boolean, default: false, required: true },
            delete: { type: Boolean, default: false, required: true },
        }
    ],
   created_at: { type: Date, default: Date.now },
   updated_at: { type: Date, default: Date.now }
}); */
