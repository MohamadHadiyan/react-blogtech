import { Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../config/sendMail";
import { validateEmail, validatePhone } from "../middleware/valid";
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from "../config/generateToken";
import { sendSMS, smsOTP, smsVerify } from "../config/sendSMS";
import {
  IDecodedToken,
  IGooglePayload,
  IReqAuth,
  IUser,
  IuserParams,
} from "../config/interface";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
import NotificationSettings from "../models/notificationSettingModel";
import PrivacySettings from "../models/privacySettingModel";
import SocialProfiles from "../models/socialProfilesModel";
import UserInterface from "../models/userInterfaceModel";
import UserSettings from "../models/userSettingsModel";

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
const CLIENT_URL = `${process.env.BASE_URL}`;
const successMsg = (str: string) => `Success! Please check your ${str}.`;

const authCtrl = {
  regiser: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body;
      const user = await User.findOne({ account });

      if (user) {
        return res
          .status(400)
          .json({ msg: "Email of phone number already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        surname: "",
        name,
        account,
        password: hashedPassword,
      };

      const active_token = generateActiveToken({ newUser });
      const url = `${CLIENT_URL}/active/${active_token}`;

      if (validateEmail(account)) {
        sendMail(
          account,
          url,
          name,
          "Verify your email address.",
          "Confirm Your Email",
          "To activate your Twilio Account, please verify your email address.<br>Your account will not be created until your email address is confirmed."
        );

        return res.status(201).json({ msg: successMsg("email") });
      } else if (validatePhone(account)) {
        sendSMS(account, url, "Verify your phone number");

        return res.status(201).json({ msg: successMsg("phone") });
      }
    } catch (err: any) {
      return res.status(500).json({
        msg: err.message,
      });
    }
  },
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;

      const decoded = <IDecodedToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );

      const { newUser } = decoded;

      if (!newUser) {
        return res.status(400).json({ msg: "Invalid authentication!" });
      }

      const user = new User(newUser);
      user.settings = await createUserSettings(user._id);

      await user.save();

      return res.status(201).json({ msg: "Account has been activated." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;
      const user = await User.findOne({ account });

      if (!user) {
        return res.status(404).json({ msg: "Account login attempt" });
      }

      loginUser(user, password, res);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      await User.findOneAndUpdate({ _id: req.user._id }, { rf_token: "" });
      res.clearCookie("refreshtoken1", { path: "/api/refresh_token" });
      res.status(200).json({ msg: "Logged out!" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const refresh_token = req.cookies.refreshtoken1;

      if (!refresh_token) {
        return res.status(400).json({ msg: "Please login now!" });
      }

      const decoded = <IDecodedToken>(
        jwt.verify(refresh_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );

      if (!decoded.id) {
        return res.status(400).json({ msg: "Please login now!" });
      }

      const user = await User.findById(decoded.id).select(
        "-password +rf_token"
      );

      if (!user) {
        return res.status(400).json({ msg: "Account not found!" });
      }

      if (refresh_token !== user.rf_token) {
        return res.status(400).json({ msg: "Please login now!" });
      }

      const access_token = generateAccessToken({ id: user._id });
      const rf_token = generateRefreshToken({ id: user._id }, res);

      await User.findOneAndUpdate({ _id: user._id }, { rf_token });

      return res.status(200).json({ access_token, user });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  googleLogin: async (req: Request, res: Response) => {
    try {
      const { id_token } = req.body;

      const verified = await client.verifyIdToken({
        idToken: id_token,
        audience: `${process.env.MAIL_CLIENT_ID}`,
      });

      const { name, email, email_verified, picture } = <IGooglePayload>(
        verified.getPayload()
      );

      if (!email_verified) {
        return res.status(400).json({ msg: "Email verification failed." });
      }

      const user = await User.findOne({ account: email });
      const password = email + `${process.env.USER_GOOGLE_PASSWORD}`;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name: name,
          account: email,
          password: hashedPassword,
          avatar: picture,
          type: "google",
        };

        registerUser(user, res);
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  facebookLogin: async (req: Request, res: Response) => {
    try {
      const { accessToken, userID } = req.body;

      const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { name, email, picture } = data;

      const user = await User.findOne({ account: email });
      const password = email + `${process.env.USER_FACEBOOK_PASSWORD}`;
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name: name,
          account: email,
          password: hashedPassword,
          avatar: picture.data.url,
          type: "facebook",
        };

        registerUser(user, res);
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  loginSMS: async (req: Request, res: Response) => {
    try {
      const { phone } = req.body;

      const data = await smsOTP(phone, "sms");

      return res.json({ data });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  verifySMS: async (req: Request, res: Response) => {
    try {
      const { phone, code } = req.body;

      const data = await smsVerify(phone, code);

      if (!data?.valid) {
        return res.status(400).json({ msg: "Invalid Authentication." });
      }

      const user = await User.findOne({ account: phone });
      const password = phone + "user phone secret password";
      const hashedPassword = await bcrypt.hash(password, 10);

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name: phone,
          account: phone,
          password: hashedPassword,
          type: "sms",
        };

        registerUser(user, res);
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { account } = req.body;

      const user = await User.findOne({ account });

      if (!user) {
        return res.status(400).json({ msg: "This account does not exist!" });
      }

      if (user.type !== "register") {
        return res.status(400).json({
          msg: `Quick login account with (${user.type}) can't use this function.`,
        });
      }

      const access_token = generateAccessToken({ id: user._id });
      const url = `${CLIENT_URL}/reset_password/${access_token}`;

      if (validateEmail(account)) {
        sendMail(
          account,
          url,
          user.name,
          "Forgot Password?",
          "Reset Password",
          "To reset your account password, please click on the link below."
        );

        return res.json({ msg: successMsg("email") });
      } else if (validatePhone(account)) {
        sendSMS(account, url, "Forgot Password?");

        return res.json({ msg: successMsg("phone") });
      }
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const loginUser = async (user: IUser, password: string, res: Response) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Failed login attempt!" });
  }

  const access_token = generateAccessToken({ id: user._id });
  const rf_token = generateRefreshToken({ id: user._id }, res);

  const settings = await createUserSettings(user._id);
  await User.findOneAndUpdate({ _id: user._id }, { rf_token, settings });
  return res.status(200).json({
    msg: "Login success",
    access_token,
    user: { ...user._doc, password: "" },
  });
};

const registerUser = async (user: IuserParams, res: Response) => {
  const newUser = new User(user);

  const access_token = generateAccessToken({ id: newUser._id });
  const rf_token = generateRefreshToken({ id: newUser._id }, res);

  newUser.rf_token = rf_token;
  newUser.settings = await createUserSettings(newUser._id);

  await newUser.save();

  return res.status(200).json({
    msg: "Login success",
    access_token,
    user: { ...newUser._doc, password: "" },
  });
};

const createUserSettings = async (user_id: string) => {
  const notifySetting = new NotificationSettings();
  const privacySetting = new PrivacySettings();
  const socialProfiles = new SocialProfiles();
  const userInterface = new UserInterface();
  const userSettings = new UserSettings({
    user: user_id,
    notificationSetting: notifySetting._id,
    privacySetting: privacySetting._id,
    socialProfiles: socialProfiles._id,
    userInterface: userInterface._id,
  });
  await notifySetting.save();
  await privacySetting.save();
  await socialProfiles.save();
  await userInterface.save();
  await userSettings.save();

  return userSettings._id;
};

export default authCtrl;
