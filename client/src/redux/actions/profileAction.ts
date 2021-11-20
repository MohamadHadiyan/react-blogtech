import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import { getAPI, patchAPI } from "../../utils/FetchData";
import { imageCheck, imageUpload } from "../../utils/ImageUpload";
import * as interfaces from "../../utils/TypeScript";
import { checkPassword } from "../../utils/Valid";
import { ALERT, IAlertType } from "../types/alertType";
import * as userTypes from "../types/authType";
import * as types from "../types/profileType";

/**
 * -------------------------------------------------------------
 * Update User Information
 * -------------------------------------------------------------
 */
export const updateUserInfo =
  (data: interfaces.IUpdateUserInfo) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    if (!data.auth.user || !data.auth.access_token) return;

    const access_token = await checkTokenExp(data.auth.access_token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const info = {
        name: data.name ? data.name : data.auth.user.name,
        heading: data.heading ? data.heading : data.auth.user.heading,
        surname: data.surname ? data.surname : data.auth.user.surname,
        intro: data.intro ? data.intro : data.auth.user.intro,
      };

      dispatch({
        type: userTypes.AUTH,
        payload: {
          access_token: data.auth.access_token,
          user: {
            ...data.auth.user,
            ...info,
          },
        },
      });

      const res = await patchAPI("user_info", info, access_token);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update User Privacy
 * -------------------------------------------------------------
 */
export const updateUserPrivacy =
  (user: interfaces.IUser, token: string) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });
      dispatch({
        type: userTypes.AUTH,
        payload: { access_token: access_token, user },
      });

      const res = await patchAPI(
        "user_privacy",
        { privacy: user.privacy },
        access_token
      );

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update User Images
 * -------------------------------------------------------------
 */
export const updateUserImages =
  (data: interfaces.IUpdateUserImages) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    if (!data.auth.user || !data.auth.access_token) return;

    const access_token = await checkTokenExp(data.auth.access_token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    let profileUrl = "";
    let coverUrl = "";

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (data.avatar) {
        const check = imageCheck(data.avatar);

        if (check) {
          return dispatch({ type: ALERT, payload: { errors: check } });
        }

        const photo = await imageUpload(data.avatar);
        profileUrl = photo.url;
      }

      if (data.coverImg) {
        const check = imageCheck(data.coverImg);

        if (check) {
          return dispatch({ type: ALERT, payload: { errors: check } });
        }
        const photo = await imageUpload(data.coverImg);
        coverUrl = photo.url;
      }
      const info = {
        avatar: profileUrl ? profileUrl : data.auth.user.avatar,
        coverImg: coverUrl ? coverUrl : data.auth.user.coverImg,
      };

      dispatch({
        type: userTypes.AUTH,
        payload: {
          access_token: data.auth.access_token,
          user: { ...data.auth.user, ...info },
        },
      });

      const res = await patchAPI("user_info", info, access_token);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Reset User Password
 * -------------------------------------------------------------
 */
export const resetPassword =
  (
    newPassword: string,
    cf_password: string,
    token: string,
    oldPassword?: string
  ) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);
    const msg = checkPassword(newPassword, cf_password);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    if (msg) {
      return dispatch({ type: ALERT, payload: { errors: msg } });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await patchAPI(
        "reset_password",
        { oldPassword, newPassword },
        access_token
      );

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Profile Info
 * -------------------------------------------------------------
 */
export const getProfileInfo =
  (id: string) =>
  async (dispatch: Dispatch<IAlertType | types.IGetProfileInfoType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await getAPI(`/user/${id}`);

      dispatch({ type: types.GET_PROFILE_INFO, payload: res.data });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Add Or Remove (Followers && Followings)
 * -------------------------------------------------------------
 */

interface IProps {
  followed_id: string;
  user_id: string;
  actionType: "add" | "remove";
  token: string;
}

export const updateFollows =
  ({ followed_id, user_id, actionType, token }: IProps) =>
  async (
    dispatch: Dispatch<IAlertType | types.ProfileType | userTypes.AuthType>
  ) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await patchAPI(
        `follows/${user_id}`,
        { followed_id },
        access_token
      );

      dispatch({
        type: actionType === "add" ? types.ADD_FOLLOWER : types.REMOVE_FOLLOWER,
        payload: { followed: res.data.followed, user: res.data.user },
      });

      dispatch({
        type:
          actionType === "add"
            ? userTypes.ADD_USER_FOLLOWING
            : userTypes.REMOVE_USER_FOLLOWING,
        payload: res.data.followed,
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Followers
 * -------------------------------------------------------------
 */
export const getFollowers =
  (_id: string, token?: string) =>
  async (
    dispatch: Dispatch<IAlertType | types.ProfileType | userTypes.AuthType>
  ) => {
    try {
      const res = await getAPI(`follows/${_id}?follow_field=followers`);

      if (token) {
        dispatch({
          type: userTypes.GET_USER_FOLLOWERS,
          payload: res.data.follows,
        });
      } else {
        dispatch({
          type: types.GET_FOLLOWERS,
          payload: { _id, followers: res.data.follows },
        });
      }
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Followings
 * -------------------------------------------------------------
 */
export const getFollowings =
  (_id: string, token?: string) =>
  async (
    dispatch: Dispatch<IAlertType | types.ProfileType | userTypes.AuthType>
  ) => {
    try {
      const res = await getAPI(`follows/${_id}?follow_field=followings`);

      if (token) {
        dispatch({
          type: userTypes.GET_USER_FOLLOWINGS,
          payload: res.data.follows,
        });
      } else {
        dispatch({
          type: types.GET_FOLLOWINGS,
          payload: { _id, followings: res.data.follows },
        });
      }
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get User Favourite Blogs
 * -------------------------------------------------------------
 */
export const getFavourites =
  (user_id: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await getAPI(`favourites/${user_id}`, access_token);

      dispatch({
        type: userTypes.GET_USER_FAVOURITES,
        payload: res.data.favourites,
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Add Or Remove User Favorite Blogs
 * -------------------------------------------------------------
 */
interface IFavouriteProps {
  user_id: string;
  blog: interfaces.IBlogCard;
  actionType: "add" | "remove";
  token: string;
}
export const updateFavourite =
  ({ user_id, blog, actionType, token }: IFavouriteProps) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await patchAPI(
        `favourites/${user_id}`,
        { blog_id: blog._id },
        access_token
      );

      if (res.data) {
        dispatch({
          type:
            actionType === "add"
              ? userTypes.ADD_USER_FAVOURITE
              : userTypes.REMOVE_USER_FAVOURITE,
          payload: blog,
        });
      }
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Add Or Remove User Blogs
 * -------------------------------------------------------------
 */
interface IBlogProps {
  user_id: string;
  blog_id: string;
  actionType: "add" | "remove";
  token: string;
}
export const updateUserBlogs =
  ({ user_id, blog_id, actionType, token }: IBlogProps) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await patchAPI(`blogs/${user_id}`, { blog_id }, access_token);
      if (res.data) {
        dispatch({
          type:
            actionType === "add"
              ? userTypes.ADD_USER_BLOG
              : userTypes.REMOVE_USER_BLOG,
          payload: blog_id,
        });
      }
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * View User Notifications (clear user notifications array)
 * -------------------------------------------------------------
 */
interface IFavouriteProps {
  user_id: string;
  blog: interfaces.IBlogCard;
  actionType: "add" | "remove";
  token: string;
}
export const viewUserNotifications =
  (auth: userTypes.IAuth) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const user = auth.user;
    const token = auth.access_token;

    if (!user || !token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid Authentication" },
      });
    }

    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await patchAPI(`user_notifies`, {}, access_token);

      if (res.data) {
        dispatch({
          type: userTypes.AUTH,
          payload: { ...auth, user: { ...user, notifications: [] } },
        });
      }
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
/**
 * -------------------------------------------------------------
 * Get User Settings
 * -------------------------------------------------------------
 */
export const getUserSettings =
  (settings_id: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await getAPI(`user_settings/${settings_id}`, access_token);

      dispatch({
        type: userTypes.GET_USER_SETTINGS,
        payload: res.data.settings,
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update User Notification Settings
 * -------------------------------------------------------------
 */
export const UpdateNotifySettings =
  (
    user_settings_id: string,
    settings: interfaces.INotifySettings,
    token: string
  ) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await patchAPI(
        `user_notify_settings/${user_settings_id}`,
        settings,
        access_token
      );

      if (res.data) {
        dispatch({
          type: userTypes.UPDATE_NOTIFY_SETTINGS,
          payload: settings,
        });
      }
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update User Interface
 * -------------------------------------------------------------
 */
export const updateUserInterface =
  (
    user_settings_id: string,
    userInterface: interfaces.IUserInterface,
    token: string
  ) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);
    const errors = "Invalid token specified.";

    if (!access_token) return dispatch({ type: ALERT, payload: { errors } });

    try {
      const res = await patchAPI(
        `user_interface/${user_settings_id}`,
        userInterface,
        access_token
      );

      if (res.data) {
        dispatch({
          type: userTypes.UPDATE_USER_INTERFACE,
          payload: userInterface,
        });
      }
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update User Social Profiles
 * -------------------------------------------------------------
 */
export const updateSocialProfiles =
  (
    user_settings_id: string,
    profiles: interfaces.ISocialProfiles,
    token: string
  ) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);
    const errors = "Invalid token specified.";

    if (!access_token) return dispatch({ type: ALERT, payload: { errors } });

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await patchAPI(
        `user_social_profiles/${user_settings_id}`,
        profiles,
        access_token
      );

      if (res.data) {
        dispatch({
          type: userTypes.UPDATE_SOCIAL_PROFILES,
          payload: profiles,
        });
      }

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update User Privacy Settings
 * -------------------------------------------------------------
 */
export const updatePrivacySettings =
  (
    user_settings_id: string,
    privacy: interfaces.IPrivacySettings,
    token: string
  ) =>
  async (dispatch: Dispatch<IAlertType | userTypes.AuthType>) => {
    const access_token = await checkTokenExp(token, dispatch);
    const errors = "Invalid token specified.";

    if (!access_token) return dispatch({ type: ALERT, payload: { errors } });

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await patchAPI(
        `user_privacy_settings/${user_settings_id}`,
        privacy,
        access_token
      );

      if (res.data) {
        dispatch({
          type: userTypes.UPDATE_PRIVACY_SETTINGS,
          payload: privacy,
        });
      }

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
