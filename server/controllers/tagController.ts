import { Request, Response } from "express";
import { Types } from "mongoose";
import { IReqAuth, IUser } from "../config/interface";
import Tag from "../models/tagModel";
import Blog from "../models/blogModel";

const tagController = {
  getTag: async (req: Request, res: Response) => {
    try {
      const tags = await Tag.find({ name: req.params.id });

      if (tags.length) return res.json(tags);

      return res.status(400).json({ msg: "Tag Not Found." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getTags: async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) * 1 || 10;
    const skip = Number(req.query.skip);

    try {
      const data = await Tag.aggregate([
        {
          $facet: {
            totalData: [
              {
                $lookup: {
                  from: "users",
                  let: { user_id: "$creator" },
                  pipeline: [
                    { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                    { $project: { name: 1, avatar: 1 } },
                  ],
                  as: "creator",
                },
              },
              { $unwind: "$creator" },
              {
                $project: {
                  name: 1,
                  creator: 1,
                  createdAt: 1,
                  consumers: 1,
                  usedCount: { $size: "$consumers" },
                },
              },
              { $sort: { usedCount: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $count: "count" }],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const tags = data[0].totalData;
      const count = data[0].count;

      return res.json({ tags, count, msg: "success" });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getSearchedTags: async (req: Request, res: Response) => {
    try {
      const name = `${req.query.name}`;
      const limit = Number(req.query.limit) || 9;

      const tags = await Tag.aggregate([
        { $match: { name: { $regex: name, $options: "gi" } } },
        {
          $lookup: {
            from: "users",
            let: { user_id: "$creator" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
              { $project: { name: 1, avatar: 1 } },
            ],
            as: "creator",
          },
        },
        { $unwind: "$creator" },
        {
          $project: {
            name: 1,
            creator: 1,
            consumers: 1,
            createdAt: 1,
            usedCount: { $size: "$consumers" },
          },
        },
        { $sort: { usedCount: -1 } },
        { $limit: limit },
      ]);

      return res.json({ tags });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createTag: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const tags = req.body.name;
      if (typeof tags === "string") {
        const name = tags.toLowerCase();
        const tag = await Tag.findOne({ name });

        if (tag) {
          return res
            .status(500)
            .json({ msg: `An tag with the name "${name}" already exists` });
        }

        const newTag = new Tag({ name, creator: req.user._id });
        await newTag.save();

        return res.json({
          tag: [newTag],
          msg: "The operation was completed successfully.",
        });
      }

      if (!Array.isArray(tags)) {
        return res.json({ msg: "Invalid data format." });
      }

      const names: string[] = tags.map((item: string) => item.toLowerCase());

      if (!names.length) return res.json({ msg: "Invalid tag names." });

      const oldTags = await Tag.find({ name: { $in: names } });
      const tagNames = oldTags.length
        ? names.filter(
            (name) => oldTags.every((item) => item.name !== name) && name
          )
        : names;

      const data = tagNames.map((name: string) => ({
        name,
        consumers: [],
        creator: (req.user as IUser)._id,
      }));

      const newTags = await Tag.insertMany(data);
      res.json({ tags: newTags, msg: "Tag created successfully." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateTag: async (req: IReqAuth, res: Response) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const name = req.body.name.toLowerCase();
      const tag = await Tag.findOne({ name });

      if (tag) {
        return res
          .status(500)
          .json({ msg: `An tag with the name "${name}" already exists` });
      }

      const updatedTag = await Tag.findByIdAndUpdate(
        { _id: req.params.id },
        { name }
      );

      if (!updatedTag) {
        return res
          .status(400)
          .json({ msg: "No tags were found with this identifier." });
      }

      return res.json({
        tag: updatedTag,
        msg: "The operation was completed successfully.",
      });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteTag: async (req: IReqAuth, res: Response) => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const _id = req.params.id;
      const tag = await Tag.findOne({ _id });

      if (!tag) {
        return res
          .status(400)
          .json({ msg: "No tags were found with this identifier." });
      }

      if (!tag.consumers.length) {
        await Tag.findOneAndDelete({ _id });

        return res.json({ msg: "The operation was completed successfully." });
      }

      // Delete tag _id from blogs
      await Blog.updateMany(
        { tags: { $in: [_id] } },
        { $pull: { tags: { $in: [_id] } } }
      );

      await Tag.findOneAndDelete({ _id });

      return res.json({ msg: "The operation was completed successfully." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  addConsumer: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { tag_ids, blog_id } = req.body;

      const oldTags: string[] = tag_ids
        .filter((id: string) => Types.ObjectId.isValid(id))
        .map((item: string) => Types.ObjectId(item));

      if (oldTags.length) {
        await Tag.updateMany(
          { _id: { $in: oldTags } },
          { $push: { consumers: blog_id } }
        );
      }

      return res.json({ msg: "success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  removeConsumer: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const { tag_ids, blog_id } = req.body;

      const tags: string[] = tag_ids
        .filter((id: string) => Types.ObjectId.isValid(id))
        .map((item: string) => Types.ObjectId(item));

      await Tag.updateMany(
        { _id: { $in: tags } },
        { $pull: { consumers: blog_id } }
      );

      return res.json({ msg: "success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default tagController;
