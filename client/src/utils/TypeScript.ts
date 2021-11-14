import { ChangeEvent, FormEvent } from "react";
import rootReducer from "../redux/reducers/index";
import { IAuth } from "../redux/types/authType";

export type RootState = ReturnType<typeof rootReducer>;

export type UserPrivacyType = "public" | "private";
export type UserType = "register" | "google" | "facebook";
export type UserRole = "user" | "admin";

export type BlogPrivacyType = "public" | "private" | "draft";
export type FormSubmit = FormEvent<HTMLFormElement>;

export type InputChange = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;
export type TColor =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "light"
  | "dark"
  | "link"
  | "purple"
  | "success-soft"
  | "danger-soft"
  | "";

export interface IParams {
  page: string;
  slug: string;
}

export interface IUserLogin {
  account: string;
  password: string;
}

export interface IUserRegister extends IUserLogin {
  name: string;
  cf_password: string;
}

export interface IUserCard {
  name: string;
  surname?: string;
  _id: string;
  avatar: string;
}

export interface INotification {
  _id: string;
  title?: string;
  image: string;
  createdAt: string;
  description: string;
  sender: string;
  receiver: string;
  link: string;
  viewed: boolean;
}

export interface IPrivacySettings {
  _id: string;
  privacy: UserPrivacyType;
  showBlogs: boolean;
  showFollowings: boolean;
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

export interface INotifySettings {
  _id: string;
  __v: number;
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
  themeMode: "dark" | "light";
  favouriteColor: TColor;
  rightNavigation: boolean;
}

export interface IUserSettings {
  _id: string;
  user: string;
  notificationSetting: INotifySettings;
  privacySetting: IPrivacySettings;
  socialProfiles: ISocialProfiles;
  userInterface: IUserInterface;
}

export interface IUser extends IUserLogin {
  name: string;
  surname: string;
  avatar: string;
  coverImg: string;
  heading: string;
  intro?: string;
  type: UserType;
  role: UserRole;
  favourites: IBlogCard[];
  followers: IUserCard[];
  followings: IUserCard[];
  privacy: UserPrivacyType;
  notifications: INotification[];
  settings?: string | IUserSettings;
  blogs: string[];
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export interface IUserProfile extends IUserRegister {
  avatar: string | File;
  coverImg: string | File;
  surname?: string;
  heading?: string;
  intro?: string;
}

export interface IUpdateUserInfo {
  name: string;
  surname?: string;
  intro?: string;
  heading?: string;
  auth: IAuth;
}

export interface IUpdateUserImages {
  avatar: File;
  coverImg: File;
  auth: IAuth;
}

export interface IAlert {
  loading?: boolean;
  errors?: string | string[];
  success?: string | string[];
}

export interface ICategory {
  _id: string;
  name: string;
  count: number;
  createdAt: string;
  updatedAt: string;
}

export interface ITag {
  _id: string;
  name: string;
  creator: string | IUserCard;
  consumers: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IBlogCard {
  _id: string;
  user: IUserCard;
  title: string;
  thumbnail: string;
  description: string;
}

export interface IBlog {
  _id?: string;
  user: string | IUser;
  title: string;
  thumbnail: string | File;
  category: string | ICategory;
  description: string;
  content: string;
  tags: string[] | ITag[];
  views?: number;
  likes: string[];
  privacy?: BlogPrivacyType;
  comments: IComment[];
  createdAt: string;
}

export interface IComment {
  _id?: string;
  user: IUser;
  content: string;
  blog_id: string;
  blog_user_id: string;
  replyCM: IComment[];
  reply_user?: IUser;
  comment_root?: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}
