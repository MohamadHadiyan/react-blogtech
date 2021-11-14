import { IUser, IUserCard } from "../../utils/TypeScript";

export const GET_PROFILE_INFO = "GET_PROFILE_INFO";
export const ADD_FOLLOWER = "ADD_FOLLOWER";
export const REMOVE_FOLLOWER = "REMOVE_FOLLOWER";
export const GET_FOLLOWERS = "GET_FOLLOWERS";
export const GET_FOLLOWINGS = "GET_FOLLOWINGS";

export interface IGetProfileInfoType {
  type: typeof GET_PROFILE_INFO;
  payload: IUser;
}

export interface IAddFollowerType {
  type: typeof ADD_FOLLOWER;
  payload: { user: IUserCard; followed: IUserCard };
}

export interface IRemoveFollowerType {
  type: typeof REMOVE_FOLLOWER;
  payload: { user: IUserCard; followed: IUserCard };
}

export interface IGetFollowersType {
  type: typeof GET_FOLLOWERS;
  payload: { _id: string; followers: IUserCard[] };
}

export interface IGetFollowingsType {
  type: typeof GET_FOLLOWINGS;
  payload: { _id: string; followings: IUserCard[] };
}

export type ProfileType =
  | IGetProfileInfoType
  | IAddFollowerType
  | IRemoveFollowerType
  | IGetFollowersType
  | IGetFollowingsType;
