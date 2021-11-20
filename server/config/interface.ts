import { Request } from "express";
import { Document } from "mongoose";

type UserPrivacyType = "public" | "private";
export type BlogPrivacyType = "public" | "private" | "draft";
type ThemeType = "dark" | "light";
export interface INotification {
  _id: string;
  title?: string;
  image?: string;
  createdAt: string;
  description: string;
  sender: string;
  receiver: string;
  link: string;
  viewed: boolean;
}

export interface ISocialProfiles {
  _id: string;
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  website: string;
}

export interface IPrivacySetting {
  _id: string;
  privacy: UserPrivacyType;
  showBlogs: boolean;
  showFollowings: boolean;
}

export interface INotifySettings {
  _id: string;
  getNotification: boolean;
  profileUpdates: boolean;
  security: boolean;
  news: boolean;
  mentions: boolean;
  messages: boolean;
  blogComments: boolean;
  blogLikes: boolean;
  followings: boolean;
  commentReplies: boolean;
  commentLikes: boolean;
}

export interface IUserInterface {
  _id: string;
  themeMode: ThemeType;
  favouriteColor: string;
  rightNavigation: boolean;
}

export interface IUserSetting {
  _id: string;
  user: string;
  notificationSetting: string;
  privacySetting: string;
  socialProfiles: string;
  userInterface: string;
}

export interface IUser extends Document {
  name: string;
  surname: string;
  account: string;
  password: string;
  coverImg: string;
  avatar: string;
  heading: string;
  intro: string;
  type: string;
  role: string;
  notifications: string[];
  blogs: string[];
  favourites: string[];
  followers: string[];
  followings: string[];
  settings: string;
  privacy: UserPrivacyType;
  rf_token?: string;
  _doc: object;
}

export interface INewUser {
  name: string;
  account: string;
  password: string;
}

export interface IDecodedToken {
  id?: number;
  newUser?: INewUser;
  iat: number;
  exp: number;
}

export interface IGooglePayload {
  name: string;
  email: string;
  email_verified: boolean;
  picture: string;
}

export interface IuserParams {
  name: string;
  account: string;
  password: string;
  avatar?: string;
  type: string;
}

export interface IUpdateUser {
  name: string;
  surname: string;
  avatar: string;
  coverImg: string;
  heading: string;
  intro: string;
}

export interface IReqAuth extends Request {
  user?: IUser;
}

export interface ICategory extends Document {
  name: string;
  _doc: object;
}

export interface ITag extends Document {
  name: string;
  creator: string;
  consumers: string[];
  _doc: object;
}

export interface IBlog {
  user: string;
  title: string;
  thumbnail: string;
  category: string;
  description: string;
  content: string;
  tags: string[];
  views: number;
  likes: string[];
  comments: string[];
  privacy: BlogPrivacyType;
  readingTime: number;
  _doc: object;
}

export interface IComment {
  user: string;
  content: string;
  blog_id: string;
  blog_user_id: string;
  replyCM: string[];
  reply_user: string;
  comment_root: string;
  createdAt: string;
  likes: string[];
  dislikes: string[];
  _doc: object;
}
