import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import * as Api from "../../utils/FetchData";
import { imageUpload } from "../../utils/ImageUpload";
import * as ITypes from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import * as types from "../types/blogType";
import { updateUserBlogs } from "./profileAction";
import { addTagsConsumer, removeTagsConsumer } from "./tagAction";

/**
 * -------------------------------------------------------------
 * Create New Blog
 * -------------------------------------------------------------
 */
export const createBlog =
  (blog: ITypes.IBlog, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ICreateBlogUserType | any>) => {
    const access_token = await checkTokenExp(token, dispatch);
    let url = "";

    if (!access_token) {
      dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (typeof blog.thumbnail === "string") {
        url = blog.thumbnail;
      } else {
        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;
      }

      const { _id, ...newBlog } = { ...blog, thumbnail: url };
      const res = await Api.postAPI("blog", newBlog, access_token);
      const data = res.data;

      if (blog.tags && blog.tags.length) {
        dispatch(
          addTagsConsumer(blog.tags as string[], data._id, access_token)
        );
      }

      dispatch(
        updateUserBlogs({
          user_id: (data.user as ITypes.IUser)._id,
          blog_id: data._id,
          actionType: "add",
          token: access_token,
        })
      );

      dispatch({ type: types.CREATE_BLOG_USER_ID, payload: res.data });

      dispatch({ type: ALERT, payload: { success: "Success" } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

type ModifiedTagType = {
  addedIDs: string[];
  removedIDs: string[];
};

/**
 * -------------------------------------------------------------
 * Update Exist Blog
 * -------------------------------------------------------------
 */
export const updateBlog =
  (blog: ITypes.IBlog, token: string, tagsModified?: ModifiedTagType) =>
  async (dispatch: Dispatch<IAlertType | types.IUpdateBlogUserType | any>) => {
    const access_token = await checkTokenExp(token, dispatch);
    let url = "";

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      if (typeof blog.thumbnail === "string") {
        url = blog.thumbnail;
      } else {
        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;
      }

      const newBlog = { ...blog, thumbnail: url };
      const res = await Api.putAPI(`blog/${blog._id}`, newBlog, access_token);

      if (res.data) {
        dispatch({ type: types.UPDATE_BLOG_USER_ID, payload: newBlog });
      }

      if (tagsModified) {
        const blog_id = blog._id as string;
        if (tagsModified.addedIDs.length) {
          dispatch(
            addTagsConsumer(tagsModified.addedIDs, blog_id, access_token)
          );
        }

        if (tagsModified.removedIDs.length) {
          dispatch(
            removeTagsConsumer(tagsModified.removedIDs, blog_id, access_token)
          );
        }
      }

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Delete Exist Blog
 * -------------------------------------------------------------
 */
export const deleteBlog =
  (blog: ITypes.IBlog, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.IDeleteBlogUserType | any>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await Api.deleteAPI(`blog/${blog._id}`, access_token);

      if (res.data) {
        dispatch({ type: types.DELETE_BLOG_USER_ID, payload: blog });
        dispatch(
          updateUserBlogs({
            user_id: (blog.user as ITypes.IUserCard)._id,
            blog_id: blog._id as string,
            actionType: "remove",
            token: access_token,
          })
        );
      }

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Blogs For Home Page With Limit (10)
 * -------------------------------------------------------------
 */
export const getHomeBlogs =
  (skip?: number) =>
  async (dispatch: Dispatch<IAlertType | types.IGetAllBlogsType>) => {
    try {
      const res = await Api.getAPI(`home/blogs?skip=${skip || 0}`);
      dispatch({ type: types.GET_ALL_BLOGS, payload: res.data });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get User Blogs With Limit (10)
 * -------------------------------------------------------------
 */
interface IPrivacyProps {
  type: ITypes.BlogPrivacyType | "";
  token: string;
}
export const getBlogsByUser =
  (id: string, search: string, limit: number, privacy?: IPrivacyProps) =>
  async (dispatch: Dispatch<IAlertType | types.IGetBlogsUserType>) => {
    try {
      let res: AxiosResponse<any>;
      if (privacy) {
        const access_token = await checkTokenExp(privacy.token, dispatch);

        if (!access_token) {
          return dispatch({
            type: ALERT,
            payload: { errors: "Invalid token specified." },
          });
        }

        const route = `blogs/user/${id}${search}&limit=${limit}&privacy_type=${privacy.type}`;
        res = await Api.getAPI(route, access_token);
      } else {
        res = await Api.getAPI(`blogs/user/${id}${search}&limit=${limit}`);
      }

      dispatch({
        type: types.GET_BLOGS_USER_ID,
        payload: { ...res.data, id, search },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Top 5 Blogs
 * -------------------------------------------------------------
 */
export const getTopBlogs =
  () => async (dispatch: Dispatch<IAlertType | types.IGetTopBlogsType>) => {
    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await Api.getAPI("top_blogs");
      dispatch({ type: types.GET_TOP_BLOGS, payload: res.data });

      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get A Blog With ID
 * -------------------------------------------------------------
 */
export const getBlog =
  (id: string, token?: string) =>
  async (dispatch: Dispatch<IAlertType | types.IGetBlogType>) => {
    let access_token = "";
    if (token) {
      access_token = await checkTokenExp(token, dispatch);

      if (!access_token) {
        return dispatch({
          type: ALERT,
          payload: { errors: "Invalid token specified." },
        });
      }
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await Api.getAPI(`blog/${id}`, access_token);

      dispatch({ type: types.GET_BLOG, payload: res.data });
      dispatch({ type: ALERT, payload: { loading: false } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update Blog Likes (Add or Remove Id From Array Likes)
 * -------------------------------------------------------------
 */
export const updateBlogLikes =
  (likes: string[], user_id: string, blog_id: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.IUpdateBlogLikesType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: types.UPDATE_BLOG_LIKES, payload: likes });
      await Api.patchAPI(`blog_likes/${blog_id}`, { user_id }, access_token);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update Blog Views (Increase The Number Of Hits)
 * -------------------------------------------------------------
 */
export const updateBlogViews =
  (views: number, blog_id: string) =>
  async (dispatch: Dispatch<IAlertType | types.IUpdateBlogViewsType>) => {
    try {
      dispatch({ type: types.UPDATE_BLOG_VIEWS, payload: views });
      await Api.patchAPI(`blog_views/${blog_id}`, { views });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
