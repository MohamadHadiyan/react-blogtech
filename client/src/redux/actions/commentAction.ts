import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../utils/FetchData";
import { IBlog, IComment } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import { IUpdateAllBlogsType, UPDATE_ALL_BLOGS } from "../types/blogType";
import * as types from "../types/commentType";

/**
 * -------------------------------------------------------------
 * Create New Comment
 * -------------------------------------------------------------
 */
export const createComment =
  (data: IComment, token: string, blog: IBlog) =>
  async (
    dispatch: Dispatch<IAlertType | types.ICommentType | IUpdateAllBlogsType>
  ) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await postAPI(
        "comment",
        { ...data, blog_title: blog.title },
        access_token
      );

      const comments = blog.comments ? blog.comments : [];

      dispatch({
        type: UPDATE_ALL_BLOGS,
        payload: { ...blog, comments: [...comments, res.data] },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Blog Comments With Limit 6
 * -------------------------------------------------------------
 */
export const getComments =
  (id: string, skip: number) =>
  async (dispatch: Dispatch<IAlertType | types.IGetCommentsType>) => {
    try {
      const res = await getAPI(`comments/blog/${id}?skip=${skip}`);

      dispatch({
        type: types.GET_COMMENTS,
        payload: { data: res.data.comments, total: res.data.total },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Reply Comment
 * -------------------------------------------------------------
 */
export const replyComment =
  (data: IComment, blog_title: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.IReplyCommentType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      await postAPI("reply_comment", { ...data, blog_title }, access_token);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update Exist Comment
 * -------------------------------------------------------------
 */
export const updateComment =
  (comment: IComment, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.IUpdateCommentType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({
        type: comment.comment_root ? types.UPDATE_REPLY : types.UPDATE_COMMENT,
        payload: comment,
      });

      await patchAPI(`comment/${comment._id}`, { comment }, access_token);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Delete Exist Comment
 * -------------------------------------------------------------
 */
export const deleteComment =
  (comment: IComment, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.IDeleteCommentType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({
        type: comment.comment_root ? types.DELETE_REPLY : types.DELETE_COMMENT,
        payload: comment,
      });

      await deleteAPI(`comment/${comment._id}`, access_token);
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Replies Comment
 * -------------------------------------------------------------
 */
export const getRepliesComment =
  (id: string) =>
  async (dispatch: Dispatch<IAlertType | types.IGetRepliesCommentType>) => {
    try {
      const res = await getAPI(`comment/${id}`);

      dispatch({
        type: types.GET_REPLIES_COMMENT,
        payload: res.data.comments,
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update Comment Likes
 * -------------------------------------------------------------
 */
export const updateCommentLikes =
  (
    comment: IComment,
    blog_title: string,
    action: "likes" | "dislikes",
    token: string
  ) =>
  async (dispatch: Dispatch<IAlertType | types.ICommentType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      await patchAPI(
        "comment_likes",
        { comment_id: comment._id, action, blog_title },
        access_token
      );

      dispatch({ type: types.UPDATE_COMMENT, payload: comment });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
