import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../utils/FetchData";
import { ITag } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import * as types from "../types/tagType";

/**
 * -------------------------------------------------------------
 * Get Tags Name And The Number Of Them Used
 * -------------------------------------------------------------
 */
export const getTagsName =
  () => async (dispatch: Dispatch<IAlertType | types.ITagType>) => {
    try {
      const res = await getAPI("tag");
      dispatch({ type: types.GET_TAGS_NAME, payload: res.data });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Tags Name With Skip For Next Page
 * -------------------------------------------------------------
 */
export const getTagsNameByPage =
  (skip: number) => async (dispatch: Dispatch<IAlertType | types.ITagType>) => {
    try {
      const res = await getAPI(`tag?skip=${(skip - 1) * 10 || 0}`);

      dispatch({
        type: types.GET_TAGS_NAME_BY_PAGE,
        payload: { tags: res.data.tags, page: skip },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Create New Tag
 * -------------------------------------------------------------
 */
export const createTag =
  (
    name: string | string[],
    token: string,
    nextAction?: (tags: ITag[], token: string) => void
  ) =>
  async (dispatch: Dispatch<IAlertType | types.ITagType | any>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await postAPI("tag", { name }, access_token);
      dispatch({ type: types.CREATE_TAG, payload: res.data.tags });

      if (nextAction) nextAction(res.data.tags, access_token);

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update Exist Tag
 * -------------------------------------------------------------
 */
export const updateTag =
  (tag: ITag, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ITagType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await patchAPI(`tag/${tag._id}`, tag, access_token);
      dispatch({
        type: types.UPDATE_TAG,
        payload: { ...res.data.tag, name: tag.name },
      });

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Delete Exist Tag
 * -------------------------------------------------------------
 */
export const deleteTag =
  (id: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ITagType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await deleteAPI(`tag/${id}`, access_token);
      dispatch({ type: types.DELETE_TAG, payload: id });

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Add Blog ID To Tag Consumbers List
 * -------------------------------------------------------------
 */
export const addTagsConsumer =
  (tag_ids: string[], blog_id: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ITagType>) => {
    try {
      const data = { tag_ids, blog_id };
      await patchAPI(`add_consumer`, data, token);

      dispatch({ type: types.ADD_TAG_CONSUMER, payload: data });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Remove Blog ID From Tag Consumbers List
 * -------------------------------------------------------------
 */
export const removeTagsConsumer =
  (tag_ids: string[], blog_id: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ITagType>) => {
    try {
      const data = { tag_ids, blog_id };
      await patchAPI(`remove_consumer`, data, token);

      dispatch({ type: types.REMOVE_TAG_CONSUMER, payload: data });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
