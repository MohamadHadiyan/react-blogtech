import { Response } from "express";
import { Types } from "mongoose";
import {
  INotifySettings,
  IPrivacySetting,
  IReqAuth,
  ISocialProfiles,
  IUserInterface,
} from "../config/interface";
import NotificationSettings from "../models/notificationSettingModel";
import PrivacySettings from "../models/privacySettingModel";
import SocialProfiles from "../models/socialProfilesModel";
import UserInterface from "../models/userInterfaceModel";
import Users from "../models/userModel";
import UserSettings from "../models/userSettingsModel";

const userSettingsController = {
  getUserSettings: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const user_id = req.user._id;
      const settting_id = req.params.id;
      const data = await UserSettings.aggregate([
        {
          $match: {
            $and: [
              { user: Types.ObjectId(user_id) },
              { _id: Types.ObjectId(settting_id) },
            ],
          },
        },
        {
          $lookup: {
            from: "notification_settings",
            localField: "notificationSetting",
            foreignField: "_id",
            as: "notificationSetting",
          },
        },
        { $unwind: "$notificationSetting" },
        {
          $lookup: {
            from: "privacy_settings",
            localField: "privacySetting",
            foreignField: "_id",
            as: "privacySetting",
          },
        },
        { $unwind: "$privacySetting" },
        {
          $lookup: {
            from: "social_profiles",
            localField: "socialProfiles",
            foreignField: "_id",
            as: "socialProfiles",
          },
        },
        { $unwind: "$socialProfiles" },
        {
          $lookup: {
            from: "user_interfaces",
            localField: "userInterface",
            foreignField: "_id",
            as: "userInterface",
          },
        },
        { $unwind: "$userInterface" },
      ]);

      if (!data.length) {
        return res.status(400).json({ msg: "Not Found." });
      }

      return res.json({ settings: data[0], msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateNotifySettings: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const settings: INotifySettings = req.body;
      const userSettings = await UserSettings.findOne({
        _id: `${req.params.id}`,
        user: `${req.user._id}`,
      });

      if (!userSettings) return res.status(400).json({ msg: "Not Found!" });

      await NotificationSettings.findOneAndUpdate(
        { _id: settings._id },
        settings
      );

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateSocialProfiles: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const profiles: ISocialProfiles = req.body;
      const userSettings = await UserSettings.findOne({
        _id: `${req.params.id}`,
        user: `${req.user._id}`,
      });

      if (!userSettings) return res.status(400).json({ msg: "Not Found!" });

      await SocialProfiles.findOneAndUpdate({ _id: profiles._id }, profiles);

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUserInterface: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const userInterface: IUserInterface = req.body;
      const userSettings = await UserSettings.findOne({
        _id: `${req.params.id}`,
        user: `${req.user._id}`,
      });

      if (!userSettings) return res.status(400).json({ msg: "Not Found!" });

      await UserInterface.findOneAndUpdate(
        { _id: userInterface._id },
        userInterface
      );

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePrivacySettings: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const privacy: IPrivacySetting = req.body;
      const userSettings = await UserSettings.findOne({
        _id: `${req.params.id}`,
        user: `${req.user._id}`,
      });

      if (!userSettings) return res.status(400).json({ msg: "Not Found!" });

      await PrivacySettings.findOneAndUpdate({ _id: privacy._id }, privacy);

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default userSettingsController;
