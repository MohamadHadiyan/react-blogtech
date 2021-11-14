import { Dispatch } from "redux";
import checkTokenExp from "../../utils/checkTokenExp";
import { getAPI, patchAPI } from "../../utils/FetchData";
import { INotification } from "../../utils/TypeScript";
import { ALERT, IAlertType } from "../types/alertType";
import {
  GET_NOTIFICATIONS,
  INotificationType,
  UPDATE_NOTIFICATION_VIEW,
} from "../types/notificationType";

/**
 * -------------------------------------------------------------
 * Get User Notifications
 * -------------------------------------------------------------
 */
export const getNotifications =
  (skip: number, limit: number, token: string) =>
  async (dispatch: Dispatch<IAlertType | INotificationType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const res = await getAPI(
        `notifications?skip=${skip}&limit=${limit}`,
        access_token
      );

      dispatch({ type: GET_NOTIFICATIONS, payload: res.data });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };

/**
 * -------------------------------------------------------------
 * Update State Notification To Viewed
 * -------------------------------------------------------------
 */
export const updateNotificationView =
  (notification: INotification, token: string) =>
  async (dispatch: Dispatch<IAlertType | INotificationType>) => {
    const access_token = await checkTokenExp(token, dispatch);

    if (!access_token) {
      return dispatch({
        type: ALERT,
        payload: { errors: "Invalid token specified." },
      });
    }

    try {
      const _id = notification._id;
      const res = await patchAPI(`notification/${_id}`, {}, access_token);

      if (res.data)
        dispatch({ type: UPDATE_NOTIFICATION_VIEW, payload: notification });
    } catch (err: any) {
      dispatch({ type: ALERT, payload: { errors: err.response.data.msg } });
    }
  };
