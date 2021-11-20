import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import { deleteAPI, getAPI, patchAPI, postAPI } from "../../utils/FetchData";
import { ICategory } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import * as types from "../types/categoryType";

/**
 * -------------------------------------------------------------
 * Create New Category
 * -------------------------------------------------------------
 */
export const createCategory =
  (name: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ICategoryType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await postAPI("category", { name: name }, access_token);

      dispatch({
        type: types.CREATE_CATEGORY,
        payload: { ...res.data.newCategory, count: 0 },
      });

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      return dispatch({
        type: ALERT,
        payload: { errors: err.response.data.msg },
      });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Categories Name With count
 * -------------------------------------------------------------
 */
export const getCategoriesName =
  () => async (dispatch: Dispatch<IAlertType | types.ICategoryType>) => {
    try {
      const res = await getAPI("category");
      dispatch({
        type: types.GET_CATEGORIES_NAME,
        payload: res.data.categories,
      });
    } catch (err: any) {
      return dispatch({
        type: ALERT,
        payload: { errors: err.response.data.msg },
      });
    }
  };

/**
 * -------------------------------------------------------------
 * Get Blogs By Category
 * -------------------------------------------------------------
 */
export const getBlogsByCategory =
  (id: string, search: string) =>
  async (dispatch: Dispatch<IAlertType | types.ICategoryType>) => {
    try {
      const res = await getAPI(`blogs/category/${id}${search}`);

      dispatch({
        type: types.GET_BLOGS_CATEGORY,
        payload: { ...res.data, id, search },
      });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update Exist Category
 * -------------------------------------------------------------
 */
export const updateCategory =
  (category: ICategory, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ICategoryType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await patchAPI(
        `category/${category._id}`,
        { name: category.name },
        access_token
      );

      if (res) {
        dispatch({ type: types.UPDATE_CATEGORY, payload: category });
      }

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      return dispatch({
        type: ALERT,
        payload: { errors: err.response.data.msg },
      });
    }
  };

/**
 * -------------------------------------------------------------
 * Delete Exist Category (If not used)
 * -------------------------------------------------------------
 */
export const deleteCategory =
  (id: string, token: string) =>
  async (dispatch: Dispatch<IAlertType | types.ICategoryType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      dispatch({ type: ALERT, payload: { loading: true } });

      const res = await deleteAPI(`category/${id}`, access_token);

      if (res) {
        dispatch({ type: types.DELETE_CATEGORY, payload: id });
      }

      dispatch({ type: ALERT, payload: { success: res.data.msg } });
    } catch (err: any) {
      return dispatch({
        type: ALERT,
        payload: { errors: err.response.data.msg },
      });
    }
  };
