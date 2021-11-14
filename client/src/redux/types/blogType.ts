import { IBlog } from "../../utils/TypeScript";

export const GET_ALL_BLOGS = "GET_HOME_BLOGS";
export const UPDATE_ALL_BLOGS = "UPDATE_ALL_BLOGS";
export const GET_TOP_BLOGS = "GET_TOP_BLOGS";

export const GET_BLOG = "GET_BLOG";
export const UPDATE_BLOG_LIKES = "UPDATE_BLOG_LIKES";
export const UPDATE_BLOG_VIEWS = "UPDATE_BLOG_VIEWS";

export const GET_BLOGS_USER_ID = "GET_BLOGS_USER_ID";
export const CREATE_BLOG_USER_ID = "CREATE_BLOG_USER_ID";
export const UPDATE_BLOG_USER_ID = "UPDATE_BLOG_USER_ID";
export const DELETE_BLOG_USER_ID = "DELETE_BLOG_USER_ID";

type AllBlogsType = {
  blogs: IBlog[];
  count: number;
};

export interface IHomeBlogsState {
  allBlogs: AllBlogsType;
  topBlogs: IBlog[];
}

export interface IGetAllBlogsType {
  type: typeof GET_ALL_BLOGS;
  payload: AllBlogsType;
}

// Get Blogs By User Id Type
export interface IBlogsUser {
  id: string;
  blogs: IBlog[];
  count: number;
  search: string;
}

export interface IGetBlogsUserType {
  type: typeof GET_BLOGS_USER_ID;
  payload: IBlogsUser;
}

export interface IGetTopBlogsType {
  type: typeof GET_TOP_BLOGS;
  payload: IBlog[];
}

export interface IUpdateAllBlogsType {
  type: typeof UPDATE_ALL_BLOGS;
  payload: IBlog;
}

export interface IGetBlogType {
  type: typeof GET_BLOG;
  payload: IBlog;
}

export interface IUpdateBlogLikesType {
  type: typeof UPDATE_BLOG_LIKES;
  payload: string[];
}

export interface IUpdateBlogViewsType {
  type: typeof UPDATE_BLOG_VIEWS;
  payload: number;
}

export interface ICreateBlogUserType {
  type: typeof CREATE_BLOG_USER_ID;
  payload: IBlog;
}

export interface IUpdateBlogUserType {
  type: typeof UPDATE_BLOG_USER_ID;
  payload: IBlog;
}

export interface IDeleteBlogUserType {
  type: typeof DELETE_BLOG_USER_ID;
  payload: IBlog;
}

export type IBlogType =
  | IGetBlogType
  | IUpdateBlogLikesType
  | IUpdateBlogViewsType;

export type IHomeBlogsType =
  | IGetAllBlogsType
  | IGetTopBlogsType
  | IUpdateAllBlogsType;

export type IBlogsUserType =
  | IGetBlogsUserType
  | ICreateBlogUserType
  | IUpdateBlogUserType
  | IDeleteBlogUserType;
