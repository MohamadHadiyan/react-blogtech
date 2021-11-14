import { IUser } from "../../utils/TypeScript";
import * as types from "../types/profileType";

const profileInfoReducer = (
  state: IUser[] = [],
  action: types.ProfileType
): IUser[] => {
  switch (action.type) {
    case types.GET_PROFILE_INFO:
      return [...state, action.payload];
    case types.ADD_FOLLOWER:
      return state.map((item) =>
        item._id === action.payload.followed._id
          ? {
              ...item,
              followers: item.followers
                ? [...item.followers, action.payload.user]
                : [action.payload.user],
            }
          : item
      );
    case types.REMOVE_FOLLOWER:
      return state.map((item) =>
        item._id === action.payload.followed._id
          ? {
              ...item,
              followers: item.followers.filter(
                (user) => user._id !== action.payload.user._id
              ),
            }
          : item
      );
    case types.GET_FOLLOWERS:
      return state.map((user) =>
        user._id === action.payload._id
          ? { ...user, followers: action.payload.followers }
          : user
      );
    case types.GET_FOLLOWINGS:
      return state.map((user) =>
        user._id === action.payload._id
          ? { ...user, followings: action.payload.followings }
          : user
      );
    default:
      return state;
  }
};

export default profileInfoReducer;
