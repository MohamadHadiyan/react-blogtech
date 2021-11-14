import { Request, Response } from "express";
import { ICategory, IReqAuth } from "../config/interface";
import Category from "../models/categoryModel";
import Blog from "../models/blogModel";

const categoryCtrl = {
  createCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    if (req.user.role !== "admin") {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const name = req.body.name.toLowerCase();

      const newCategory = new Category({ name });
      await newCategory.save();

      return res
        .status(201)
        .json({ newCategory, msg: "Created successfully." });
    } catch (err: any) {
      let errMsg = "";
      if (err.code === 11000) {
        errMsg = Object.values(err.keyValue)[0] + "is already exists.";
      } else {
        let name = Object.keys(err.errors)[0];
        errMsg = err.errors[`${name}`].message;
      }

      return res.status(500).json({ msg: errMsg });
    }
  },
  getCategories: async (req: Request, res: Response) => {
    try {
      const allCategories = await Category.find({}).sort("-createdAt");
      const usedCategories: ICategory[] = await Blog.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        {
          $group: {
            _id: "$category._id",
            name: { $first: "$category.name" },
            createdAt: { $first: "$category.createdAt" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            count: 1,
            name: 1,
            createdAt: 1,
          },
        },
      ]);

      const categories = allCategories.map(
        (item) =>
          usedCategories.find((cate) => item.name === cate.name) || {
            ...item._doc,
            count: 0,
          }
      );

      return res.status(200).json({ categories });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    if (req.user.role !== "admin") {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const name = req.body.name.toLowerCase();

      const category = await Category.findOne({ name });

      if (category) {
        return res.status(400).json({ msg: `${name} is already exists.` });
      }

      await Category.findByIdAndUpdate({ _id: req.params.id }, { name });

      return res.status(201).json({ msg: "Update Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user) {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    if (req.user.role !== "admin") {
      return res.status(400).json({ msg: "Invalid Authentication." });
    }

    try {
      const blog = await Blog.findOne({ category: req.params.id });

      if (blog) {
        return res.status(400).json({
          msg: "Can not be deleted. One or more blogs use this category name.",
        });
      }

      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(400).json({ msg: "Category does not exist." });
      }

      return res.status(203).json({ msg: "Delete Success." });
    } catch (err: any) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

export default categoryCtrl;
