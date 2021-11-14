import {
  IBlogCard,
  INotifySettings,
  IPrivacySettings,
  ISocialProfiles,
  IUser,
  IUserCard,
  IUserInterface,
  IUserSettings,
} from "../../utils/TypeScript";

export const AUTH = "AUTH";

export const ADD_USER_FOLLOWING = "ADD_USER_FOLLOWINGS";
export const REMOVE_USER_FOLLOWING = "REMOVE_USER_FOLLOWINGS";
export const GET_USER_FOLLOWINGS = "GET_USER_FOLLOWINGS";
export const GET_USER_FOLLOWERS = "GET_USER_FOLLOWERS";

export const ADD_USER_BLOG = "ADD_USER_BLOG";
export const REMOVE_USER_BLOG = "REMOVE_USER_BLOG";

export const ADD_USER_FAVOURITE = "ADD_USER_FAVOURITE";
export const REMOVE_USER_FAVOURITE = "REMOVE_USER_FAVOURITE";
export const GET_USER_FAVOURITES = "GET_USER_FAVOURITES";

export const GET_USER_SETTINGS = "GET_USER_SETTINGS";
export const UPDATE_NOTIFY_SETTINGS = "UPDATE_NOTIFY_SETTINGS";
export const UPDATE_SOCIAL_PROFILES = "UPDATE_SOCIAL_PROFILES";
export const UPDATE_USER_INTERFACE = "UPDATE_USER_INTERFACE";
export const UPDATE_PRIVACY_SETTINGS = "UPDATE_PRIVACY_SETTINGS";

export interface IAuth {
  msg?: string;
  access_token?: string;
  user?: IUser;
}

export interface IAuthType {
  type: typeof AUTH;
  payload: IAuth;
}

export interface IAddUserFollowingType {
  type: typeof ADD_USER_FOLLOWING;
  payload: IUserCard;
}

export interface IRemoveUserFollowingType {
  type: typeof REMOVE_USER_FOLLOWING;
  payload: IUserCard;
}

export interface IGetUserFollowingsType {
  type: typeof GET_USER_FOLLOWINGS;
  payload: IUserCard[];
}

export interface IGetUserFollowersType {
  type: typeof GET_USER_FOLLOWERS;
  payload: IUserCard[];
}

export interface IAddFavouriteType {
  type: typeof ADD_USER_FAVOURITE;
  payload: IBlogCard;
}

export interface IRemoveFavouriteType {
  type: typeof REMOVE_USER_FAVOURITE;
  payload: IBlogCard;
}

export interface IGetFavouritesType {
  type: typeof GET_USER_FAVOURITES;
  payload: IBlogCard[];
}

export interface IAddBlogType {
  type: typeof ADD_USER_BLOG;
  payload: string;
}

export interface IRemoveBlogType {
  type: typeof REMOVE_USER_BLOG;
  payload: string;
}

export interface IGetUserSettingsType {
  type: typeof GET_USER_SETTINGS;
  payload: IUserSettings;
}

export interface IUpdateNotifySettingsType {
  type: typeof UPDATE_NOTIFY_SETTINGS;
  payload: INotifySettings;
}

export interface IUpdateSocialProfilesType {
  type: typeof UPDATE_SOCIAL_PROFILES;
  payload: ISocialProfiles;
}

export interface IUpdateUserInterfaceType {
  type: typeof UPDATE_USER_INTERFACE;
  payload: IUserInterface;
}

export interface IUpdatePrivacySettingsType {
  type: typeof UPDATE_PRIVACY_SETTINGS;
  payload: IPrivacySettings;
}

export type AuthType =
  | IAuthType
  | IAddUserFollowingType
  | IRemoveUserFollowingType
  | IGetUserFollowingsType
  | IGetUserFollowersType
  | IAddFavouriteType
  | IRemoveFavouriteType
  | IGetFavouritesType
  | IAddBlogType
  | IRemoveBlogType
  | IGetUserSettingsType
  | IUpdateNotifySettingsType
  | IUpdateSocialProfilesType
  | IUpdateUserInterfaceType
  | IUpdatePrivacySettingsType;
