import { Request, Response } from "express";
import { IReqAuth, IUpdateUser } from "../config/interface";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import { Types } from "mongoose";
import Blogs from "../models/blogModel";
import Notifications from "../models/notificationModel";

const userController = {
  updateUserInfo: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const updateUser: IUpdateUser = req.body;

      await User.findByIdAndUpdate({ _id: req.user._id }, updateUser);

      res.json({ msg: "Update Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUserPrivacy: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { privacy } = req.body;

      await User.findByIdAndUpdate({ _id: req.user._id }, { privacy });

      res.json({ msg: "Update Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    if (req.user.type !== "register") {
      return res.status(400).json({
        msg: `Quick login account with ${req.user.type} can't use this function.`,
      });
    }

    try {
      const { oldPassword, newPassword } = req.body;

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(400).json({ msg: "Invalid Authentication." });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "Old password is incorrect." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

      res.json({ msg: "Reset Password Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id).select("-password");

      if (!user) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      if (user.privacy && user.privacy === "private") {
        return res.status(400).json({ msg: "This is a private account." });
      }

      res.json(user);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },

  getAllUsers: async (req: Request, res: Response) => {
    try {
      const users = await User.find().select("+name +surname +avatar");

      res.json(users);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getFollows: async (req: Request, res: Response) => {
    try {
      const followField = `${req.query.follow_field}`; // followers || followings

      if (!followField) {
        return res
          .status(400)
          .json({ msg: "There is no follow_field on the query." });
      }

      const data = await User.aggregate([
        { $match: { _id: Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "users",
            let: { follow_ids: `$${followField}` },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$follow_ids"] } } },
              { $project: { name: 1, avatar: 1, surname: 1 } },
            ],
            as: `${followField}`,
          },
        },
        { $unwind: `$${followField}` },
        {
          $group: {
            _id: null,
            follows: { $push: `$${followField}` },
            total: { $sum: 1 },
          },
        },
        {
          $replaceRoot: {
            newRoot: { follows: "$follows", total: "$total" },
          },
        },
        { $project: { _id: 0 } },
      ]);

      const follows = data[0].follows;
      const total = data[0].total;

      return res.json({ follows, total, msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateFollows: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { followed_id } = req.body;
      const followed = await User.findOne({ _id: followed_id });
      const user = req.user;

      if (!followed) {
        return res.status(400).json({ msg: "Invalid Authentication." });
      }

      if (user.followings && user.followings.includes(followed_id)) {
        await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { followings: followed_id } }
        );

        await User.findOneAndUpdate(
          { _id: followed_id },
          { $pull: { followers: user._id } }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: user._id },
          { $push: { followings: followed_id } }
        );

        await User.findOneAndUpdate(
          { _id: followed_id },
          { $push: { followers: user._id } }
        );

        // Notification
        if (`${user._id}` !== `${followed_id}`) {
          const notify = new Notifications({
            title: `${user.name}${user.surname ? " " + user.surname : ""}`,
            image: user.avatar,
            sender: user._id,
            receiver: followed_id,
            description: `started following you.`,
            link: `/profile/${user._id}`,
          });

          await notify.save();
          await User.findOneAndUpdate(
            { _id: followed_id },
            { $push: { notifications: notify._id } }
          );
        }
      }

      return res.json({
        followed: {
          name: followed.name,
          _id: followed._id,
          avatar: followed.avatar,
        },
        user: { name: user.name, _id: user._id, avatar: user.avatar },
        msg: "Success.",
      });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getFavourites: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const data = await User.aggregate([
        { $match: { _id: Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "blogs",
            let: { blog_id: "$favourites" },
            pipeline: [
              { $match: { $expr: { $in: ["$_id", "$$blog_id"] } } },
              {
                $lookup: {
                  from: "users",
                  let: { user_id: "$user" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    { $project: { name: 1, avatar: 1 } },
                  ],
                  as: "user",
                },
              },
              { $unwind: "$user" },
              { $project: { title: 1, user: 1, description: 1, thumbnail: 1 } }, // does not return password
            ],
            as: "favourites",
          },
        },
        { $unwind: `$favourites` },
        {
          $group: {
            _id: null,
            favourites: { $push: `$favourites` },
            total: { $sum: 1 },
          },
        },
        {
          $replaceRoot: {
            newRoot: { favourites: "$favourites", total: "$total" },
          },
        },
        { $project: { _id: 0 } },
      ]);

      const favourites = data[0].favourites;
      const total = data[0].total;

      return res.json({ favourites, total, msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateFavourite: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { blog_id } = req.body;
      const user_id = req.params.id;

      const user = await User.findOne({ _id: user_id });
      const blog = await Blogs.findOne({ _id: blog_id });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Authentication." });
      }

      if (!blog) {
        return res.status(400).json({ msg: "There is no blog with this ID." });
      }

      if (user.favourites && user.favourites.includes(blog_id)) {
        await User.findOneAndUpdate(
          { _id: user_id },
          { $pull: { favourites: blog_id } }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: user_id },
          { $push: { favourites: blog_id } }
        );
      }

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUserBlogs: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { blog_id } = req.body;
      const user_id = req.params.id;

      const user = await User.findOne({ _id: user_id });

      if (!user) {
        return res.status(400).json({ msg: "Invalid Authentication." });
      }

      if (user.blogs && user.blogs.includes(blog_id)) {
        await User.findOneAndUpdate(
          { _id: user_id },
          { $pull: { blogs: blog_id } }
        );
      } else {
        await User.findOneAndUpdate(
          { _id: user_id },
          { $push: { blogs: blog_id } }
        );
      }

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  viewUserNotifications: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const user_id = req.user._id;
      await User.findOneAndUpdate({ _id: user_id }, { notifications: [] });

      return res.json({ msg: "Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default userController;
