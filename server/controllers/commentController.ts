import { Request, Response } from "express";
import { Types } from "mongoose";
import { io } from "../index";
import { IReqAuth } from "../config/interface";
import Comment from "../models/commentModel";
import Users from "../models/userModel";
import Notifications from "../models/notificationModel";

const Pagination = (req: Request) => {
  const page = Number(req.query.page) * 1 || 1;
  const limit = Number(req.query.limit) * 1 || 5;
  const skip = Number(req.query.skip);

  return { page, limit, skip };
};

const commentController = {
  createComment: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { content, blog_id, blog_user_id, blog_title } = req.body;
      const newComment = new Comment({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
      });

      // Socket.io
      const data = {
        ...newComment._doc,
        user: req.user,
        createdAt: new Date().toISOString(),
      };

      io.to(`${blog_id}`).emit("createComment", data);

      await newComment.save();

      // Notification
      const user = req.user;
      if (`${user._id}` !== `${blog_user_id}`) {
        const notify = new Notifications({
          title: `${user.name}${user.surname ? " " + user.surname : ""}`,
          image: user.avatar,
          sender: user._id,
          receiver: blog_user_id,
          description: `posted a comment on your blog "${blog_title}"`,
          link: `/blog/${blog_id}#comments`,
        });

        await notify.save();
        await Users.findOneAndUpdate(
          { _id: blog_user_id },
          { $push: { notifications: notify._id } }
        );
      }

      return res.json(newComment);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getComments: async (req: Request, res: Response) => {
    const { limit, skip } = Pagination(req);
    try {
      const data = await Comment.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  blog_id: Types.ObjectId(req.params.id),
                  comment_root: { $exists: false },
                  reply_user: { $exists: false },
                },
              },
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
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  blog_id: Types.ObjectId(req.params.id),
                  comment_root: { $exists: false },
                  reply_user: { $exists: false },
                },
              },
              {
                $count: "count",
              },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const comments = data[0].totalData;
      const count = data[0].count;
      const total =
        count % limit === 0 ? count / limit : Math.floor(count / limit) + 1;

      return res.json({ comments, total: count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  replyComment: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication" });
    }
    try {
      const {
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user,
        blog_title,
      } = req.body;

      const newComment = new Comment({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
        comment_root,
        reply_user: reply_user._id,
      });

      await Comment.findOneAndUpdate(
        { _id: comment_root },
        {
          $push: { replyCM: newComment._id },
        }
      );

      // Socket.io
      const data = {
        ...newComment._doc,
        user: req.user,
        reply_user,
        createdAt: new Date().toISOString(),
      };

      io.to(`${blog_id}`).emit("replyComment", data);

      await newComment.save();

      // Notification
      const user = req.user;
      const notify = new Notifications({
        title: `${user.name}${user.surname ? " " + user.surname : ""}`,
        image: user.avatar,
        sender: user._id,
        receiver: reply_user,
        description: `replied to your comment on "${blog_title}"`,
        link: `/blog/${blog_id}#comments`,
      });

      await notify.save();
      await Users.findOneAndUpdate(
        { _id: reply_user },
        { $push: { notifications: notify._id } }
      );

      return res.json(newComment);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateComment: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { comment } = req.body;

      const updatedComment = await Comment.findByIdAndUpdate(
        { _id: req.params.id, user: req.user._id },
        {
          content: comment.content,
        }
      );

      if (!updatedComment) {
        return res.status(400).json({ msg: "Comment does not exists." });
      }

      io.to(`${comment.blog_id}`).emit("updateComment", comment);

      res.json({ msg: "Update Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteComment: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const comment = await Comment.findOneAndDelete({
        _id: req.params.id,
        $or: [{ user: req.user._id }, { blog_user_id: req.user._id }],
      });

      if (!comment) {
        return res.status(400).json({ msg: "Comment does not exists." });
      }

      if (comment.comment_root) {
        await Comment.findOneAndUpdate(
          { _id: comment.comment_root },
          {
            $pull: { replyCM: comment._id },
          }
        );
      } else {
        await Comment.deleteMany({ _id: { $in: comment.replyCM } });
      }

      // Socket.io
      io.to(`${comment.blog_id}`).emit("deleteComment", comment);

      res.json({ msg: "Delete Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getCommentReplies: async (req: Request, res: Response) => {
    try {
      const data = await Comment.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  comment_root: Types.ObjectId(req.params.id),
                },
              },
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
              {
                $lookup: {
                  from: "users",
                  let: { reply_user_id: "$reply_user" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$reply_user_id"] } } },
                    { $project: { name: 1, avatar: 1 } },
                  ],
                  as: "reply_user",
                },
              },
              { $unwind: "$reply_user" },
              {
                $lookup: {
                  from: "comments",
                  let: { cm_id: "$replyCM" },
                  pipeline: [
                    { $match: { $expr: { $in: ["$_id", "$$cm_id"] } } },
                  ],
                  as: "replyCM",
                },
              },
              { $sort: { createdAt: 1 } },
            ],
            totalCount: [
              {
                $match: {
                  comment_root: Types.ObjectId(req.params.id),
                },
              },
              {
                $count: "count",
              },
            ],
          },
        },
        {
          $project: {
            count: {
              $arrayElemAt: ["$totalCount.count", 0],
            },
            totalData: 1,
          },
        },
      ]);
      const comments = data[0].totalData;
      const count = data[0].count;

      return res.json({ comments, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCommentLikes: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { comment_id, action, blog_title } = req.body;
      const comment = await Comment.findOne({ _id: comment_id });
      const user_id: string = req.user._id;

      if (!comment) {
        return res.status(400).json({ msg: "Comment does not exist" });
      }

      if (comment.likes.includes(user_id)) {
        await Comment.findOneAndUpdate(
          { _id: comment_id },
          {
            $pull: { likes: user_id },
          }
        );
      } else if (comment.dislikes.includes(user_id)) {
        await Comment.findOneAndUpdate(
          { _id: comment_id },
          {
            $pull: { dislikes: user_id },
          }
        );
      } else {
        await Comment.findOneAndUpdate(
          { _id: comment_id },
          {
            $push: { [action]: user_id },
          }
        );
      }

      // Socket.io
      io.to(`${comment.blog_id}`).emit("updateCommentLikes", comment);

      // Notification
      const user = req.user;
      if (`${user._id}` !== `${comment.user}`) {
        const notify = new Notifications({
          title: `${user.name}${user.surname ? " " + user.surname : ""}`,
          image: user.avatar,
          sender: user._id,
          receiver: comment.user,
          description: `${action} your comment on "${blog_title}"`,
          link: `/blog/${comment.blog_id}#comments`,
        });

        await notify.save();
        await Users.findOneAndUpdate(
          { _id: comment.user },
          { $push: { notifications: notify._id } }
        );
      }

      return res.json({ msg: "success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default commentController;
