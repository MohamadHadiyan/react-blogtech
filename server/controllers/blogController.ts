import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { io } from "../index";
import { IBlog, IReqAuth, IUser } from "../config/interface";
import Blogs from "../models/blogModel";
import Comments from "../models/commentModel";
import Tags from "../models/tagModel";
import Users from "../models/userModel";
import Notifications from "../models/notificationModel";

const pagination = (req: IReqAuth) => {
  const page = Number(req.query.page) * 1 || 1;
  const limit = Number(req.query.limit) * 1 || 6;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const _user = {
  $lookup: {
    from: "users",
    let: { user_id: "$user" },
    pipeline: [
      { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
      { $project: { name: 1, avatar: 1, followers: 1 } }, // does not return password
    ],
    as: "user",
  },
};

const _category = {
  $lookup: {
    from: "categories",
    localField: "category",
    foreignField: "_id",
    as: "category",
  },
};

const _comment = {
  $lookup: {
    from: "comments",
    let: { cm_id: "$_id" },
    pipeline: [
      {
        $match: {
          $and: [
            { $expr: { $eq: ["$blog_id", "$$cm_id"] } },
            { comment_root: { $exists: false } },
          ],
        },
      },
      { $project: { _id: 1 } },
    ],
    as: "comments",
  },
};

const blogCtrl = {
  getBlog: async (req: IReqAuth, res: Response) => {
    try {
      const blog_id = Types.ObjectId(req.params.id);
      const blog = await Blogs.findOne({ _id: blog_id });
      const msg = "Blog does not exists.";

      if (!blog) return res.status(400).json({ msg });

      const _match =
        req.user && `${req.user._id}` === `${blog.user}`
          ? { _id: { $eq: Types.ObjectId(req.params.id) } }
          : {
              $and: [
                { _id: { $eq: Types.ObjectId(req.params.id) } },
                { privacy: { $ne: "private" } },
                { privacy: { $ne: "draft" } },
              ],
            };

      const blogs = await Blogs.aggregate([
        { $match: _match },
        _user,
        { $unwind: "$user" },
        _category,
        { $unwind: "$category" },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },
        _comment,
      ]);

      if (blogs.length === 0) return res.status(400).json({ msg });

      return res.json(blogs[0]);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const user = req.user._id;
      const data: IBlog = req.body;

      const newBlog = new Blogs({
        ...data,
        user,
        title: data.title.toLowerCase(),
      });

      await newBlog.save();

      return res.json({ ...newBlog._doc, user: req.user });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const blog = await Blogs.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body
      );

      if (!blog) {
        return res.status(400).json({ msg: "Blog does not exist." });
      }

      return res.json({ msg: "Update Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const blog = await Blogs.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      if (!blog) {
        return res.status(400).json({ msg: "Blog does not exist." });
      }

      // Delete Comments
      await Comments.deleteMany({ blog_id: blog._id });
      // Update Tags
      await Tags.updateMany(
        { consumers: { $in: [blog._id] } },
        { $pull: { consumers: { $in: [blog._id] } } }
      );
      // Update Favourites
      await Users.updateMany(
        { favourites: { $in: [blog._id] } },
        { $pull: { favourites: { $in: [blog.id] } } }
      );

      return res.json({ msg: "Blog deletion completed successfully." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getHomeBlogs: async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) * 1 || 10;
    const skip = Number(req.query.skip);
    const _match = {
      $match: {
        $and: [{ privacy: { $ne: "private" } }, { privacy: { $ne: "draft" } }],
      },
    };

    try {
      const data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              _match,
              _user,
              { $unwind: "$user" },
              _category,
              { $unwind: "$category" },
              _comment,
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              { $project: { content: 0 } },
            ],
            totalCount: [_match, { $count: "count" }],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const blogs = data[0].totalData;
      const count = data[0].count;

      return res.json({ blogs, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogsByCategory: async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req);
    const _match = {
      $match: {
        $and: [
          { category: Types.ObjectId(req.params.id) },
          { privacy: { $ne: "private" } },
          { privacy: { $ne: "draft" } },
        ],
      },
    };

    try {
      const data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              _match,
              _user,
              { $unwind: "$user" },
              _comment,
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              { $project: { content: 0 } },
            ],
            totalCount: [_match, { $count: "count" }],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const blogs = data[0].totalData;
      const count = data[0].count;

      return res.json({ blogs, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogsByUser: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = pagination(req);
    const user_id = Types.ObjectId(`${req.params.id}`);
    const privacy_type = `${req.query.privacy_type}`;
    const _match =
      req.user && `${req.user._id}` === `${req.params.id}`
        ? privacy_type
          ? { user: user_id, privacy: { $eq: privacy_type } }
          : { user: user_id }
        : {
            $and: [
              { user: user_id },
              { privacy: { $ne: "private" } },
              { privacy: { $ne: "draft" } },
            ],
          };

    try {
      const data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              { $match: _match },
              _user,
              { $unwind: "$user" },
              _comment,
              /* ========= Sorting ========= */
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              { $project: { content: 0 } },
            ],
            totalCount: [{ $match: _match }, { $count: "count" }],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const blogs = data[0].totalData;
      const count = data[0].count;

      res.status(201).json({ blogs, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogsBySearch: async (req: Request, res: Response, next: NextFunction) => {
    if (!req.query.title) return next();

    try {
      const data = await Blogs.aggregate([
        {
          $search: {
            index: "searchTitle",
            autocomplete: {
              query: `${req.query.title}`,
              path: "title",
            },
          },
        },
        {
          $match: {
            $and: [
              { privacy: { $ne: "private" } },
              { privacy: { $ne: "draft" } },
            ],
          },
        },
        _user,
        { $unwind: "$user" },
        _category,
        { $unwind: "$category" },
        { $sort: { createdAt: -1 } },
        { $limit: 10 },
        { $unset: "content" },
        {
          $group: {
            _id: null,
            docs: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            count: 1,
            docs: { $slice: ["$docs", 5] },
          },
        },
      ]);

      if (!data.length || !data[0].docs.length) {
        const msg = "There are no blogs with this title.";
        return res.status(400).json({ msg });
      }

      const blogs = data[0].docs;
      const count = data[0].count;

      return res.json({ blogs, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  searchBlogsTitle: async (req: Request, res: Response) => {
    try {
      const blogs = await Blogs.aggregate([
        {
          $search: {
            index: "searchTitle",
            autocomplete: {
              query: `${req.query.title}`,
              path: "title",
            },
          },
        },
        {
          $match: {
            $and: [
              { privacy: { $ne: "private" } },
              { privacy: { $ne: "draft" } },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 8 },
        {
          $project: {
            title: 1,
          },
        },
      ]);

      if (!blogs.length) {
        return res.status(400).json({ msg: "There is no blog." });
      }
      return res.json(blogs);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUserBlogsBySearch: async (req: IReqAuth, res: Response) => {
    const { limit, skip } = pagination(req);

    const _match =
      req.user && `${req.user._id}` === `${req.params.id}`
        ? [
            { user: Types.ObjectId(`${req.params.id}`) },
            { title: { $regex: `${req.query.title}`, $options: "gi" } },
          ]
        : [
            { user: Types.ObjectId(`${req.params.id}`) },
            { title: { $regex: `${req.query.title}`, $options: "gi" } },
            { privacy: { $ne: "private" } },
            { privacy: { $ne: "draft" } },
          ];

    try {
      const data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              { $match: { $and: _match } },
              _user,
              { $unwind: "$user" },
              _comment,
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              { $project: { content: 0 } },
            ],
            totalCount: [{ $match: { $and: _match } }, { $count: "count" }],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const msg = "There are no blogs with this title.";
      if (!data.length) return res.status(400).json({ msg });

      const blogs = data[0].totalData;
      const count = data[0].count;

      if (!blogs.length) return res.status(400).json({ msg });

      return res.json({ blogs, count });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateBlogLikes: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }
    try {
      const user_id: string = req.body.user_id;
      const blog_id = Types.ObjectId(`${req.params.id}`);
      const blog = await Blogs.findOne({ _id: blog_id });

      if (!blog) {
        return res.status(400).json({ msg: "Blog dose not exists." });
      }

      let likes = blog.likes;

      if (blog.likes.includes(user_id)) {
        await Blogs.findOneAndUpdate(
          { _id: blog_id },
          { $pull: { likes: user_id } }
        );
        likes = likes.filter((item) => item !== user_id);
      } else {
        await Blogs.findOneAndUpdate(
          { _id: blog_id },
          { $push: { likes: user_id } }
        );
        likes = [...likes, user_id];

        // Notification
        const user = req.user;
        if (`${user._id}` !== `${blog.user}`) {
          const notify = new Notifications({
            title: `${user.name}${user.surname ? " " + user.surname : ""}`,
            image: user.avatar,
            sender: user._id,
            receiver: blog.user,
            description: `Likes your blog "${blog.title}"`,
            link: `/blog/${blog._id}`,
          });

          await notify.save();
          await Users.findOneAndUpdate(
            { _id: blog.user },
            { $push: { notifications: notify._id } }
          );
        }
      }

      // Socket.io
      io.to(`${blog._id}`).emit("updateBlogLikes", { likes });

      return res.json({ msg: "Updated Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateBlogViews: async (req: Request, res: Response) => {
    try {
      const { views } = req.body;

      const updatedBlog = await Blogs.findByIdAndUpdate(
        { _id: req.params.id },
        {
          views,
        }
      );

      if (!updatedBlog) {
        return res.status(400).json({ msg: "Blog does not exists." });
      }

      // Socket.io
      io.to(`${updatedBlog._id}`).emit("updateBlogViews", { views });

      return res.json({ msg: "Update Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getArchiveBlogCount: async (req: Request, res: Response) => {
    try {
      const blogs = await Blogs.aggregate([
        {
          $match: {
            $and: [
              { privacy: { $ne: "private" } },
              { privacy: { $ne: "draft" } },
            ],
          },
        },
        {
          $project: {
            createdAt: {
              $dateToString: {
                format: "%Y-%m",
                date: "$createdAt",
              },
            },
          },
        },
        {
          $group: {
            _id: {
              createdAt: "$createdAt",
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            createdAt: "$_id.createdAt",
            total: "$count",
            _id: 0,
          },
        },
      ]);

      return res.json(blogs);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getArchiveBlogs: async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req);
    const from = new Date(`${req.query.date}`);
    const to =
      from.getMonth() === 11
        ? new Date(from.getFullYear() + 1, 0)
        : new Date(from.getFullYear(), from.getMonth() + 1);

    try {
      const data = await Blogs.aggregate([
        {
          $match: {
            $and: [
              { createdAt: { $gte: from, $lt: to } },
              { privacy: { $ne: "private" } },
              { privacy: { $ne: "draft" } },
            ],
          },
        },
        /* ============ User ============ */
        _user,
        { $unwind: "$user" },
        /* ========= Category ========== */
        _category,
        { $unwind: "$category" },
        /* ========= Sorting ========= */
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            content: 0,
          },
        },
      ]);

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTopBlogs: async (req: Request, res: Response) => {
    const limit = parseInt(`${req.query.limit}`) || 4;

    try {
      const data = await Blogs.aggregate([
        {
          $match: {
            $and: [
              { privacy: { $ne: "private" } },
              { privacy: { $ne: "draft" } },
            ],
          },
        },
        _user,
        { $unwind: "$user" },
        _comment,
        _category,
        { $unwind: "$category" },
        { $sort: { views: -1 } },
        { $limit: limit },
        {
          $project: {
            content: 0,
          },
        },
      ]);

      return res.json(data);
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getBlogsByTag: async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req);
    const _id = Types.ObjectId(`${req.query.tag}`);
    const _match = {
      $match: {
        $and: [
          { tags: { $in: [_id] } },
          { privacy: { $ne: "private" } },
          { privacy: { $ne: "draft" } },
        ],
      },
    };

    try {
      const data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              _match,
              _user,
              { $unwind: "$user" },
              _comment,
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
              { $project: { content: 0 } },
            ],
            totalCount: [_match, { $count: "count" }],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      if (data[0].totalData.length === 0) {
        return res
          .status(400)
          .json({ msg: "There are no blogs with this tag." });
      }

      const blogs = data[0].totalData;
      const count = data[0].count;

      return res.json({ blogs, count, msg: "success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default blogCtrl;
