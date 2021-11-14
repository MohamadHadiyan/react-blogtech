import { IBlog, ICategory } from "../../utils/TypeScript";

export const CREATE_CATEGORY = "CREATE_CATEGORY";
export const UPDATE_CATEGORY = "UPDATE_CATEGORY";
export const DELETE_CATEGORY = "DELETE_CATEGORY";

export const GET_CATEGORIES_NAME = "GET_CATEGORIES_NAME";
export const GET_BLOGS_CATEGORY = "GET_BLOGS_CATEGORY";

export interface ICategoryBlogs {
  blogs: IBlog[];
  search: string;
  id: string;
  count: number;
}

export interface ICategoriesState {
  categoryBlogs: ICategoryBlogs[];
  names: ICategory[];
}

export interface IGetCategoriesName {
  type: typeof GET_CATEGORIES_NAME;
  payload: ICategory[];
}

export interface IGetBlogsCategory {
  type: typeof GET_BLOGS_CATEGORY;
  payload: ICategoryBlogs;
}

export interface ICreateCategory {
  type: typeof CREATE_CATEGORY;
  payload: ICategory;
}

export interface IUpdateCategory {
  type: typeof UPDATE_CATEGORY;
  payload: ICategory;
}

export interface IDeleteCategory {
  type: typeof DELETE_CATEGORY;
  payload: string;
}

export type ICategoryType =
  | IGetCategoriesName
  | IGetBlogsCategory
  | ICreateCategory
  | IUpdateCategory
  | IDeleteCategory;
